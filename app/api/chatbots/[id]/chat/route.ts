import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { embed, generateText } from "ai"
import { NextResponse } from "next/server"

import {
  DOCUMENTS_BUCKET,
  GEMINI_EMBEDDING_MODEL_ID,
  getEmbeddingDimensions,
} from "@/lib/ai/embedding-config"
import { parseChunksSidecar } from "@/lib/rag/chunks-sidecar"
import { cosineSimilarity } from "@/lib/rag/cosine-similarity"
import { resolveGeminiChatModelId } from "@/lib/rag/resolve-chat-model"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 120

const TOP_K_CHUNKS = 8

type ChatMessage = { role: "user" | "assistant"; content: string }

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params
  const chatbotId = Number.parseInt(idParam, 10)
  if (!Number.isFinite(chatbotId)) {
    return NextResponse.json({ error: "Invalid chatbot id" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey?.trim()) {
    return NextResponse.json(
      { error: "Server missing GOOGLE_GENERATIVE_AI_API_KEY" },
      { status: 503 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const rawMessages = (body as { messages?: unknown }).messages
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "messages[] required" }, { status: 400 })
  }

  const messages: ChatMessage[] = []
  for (const m of rawMessages) {
    if (!m || typeof m !== "object") continue
    const role = (m as { role?: string }).role
    const content = (m as { content?: string }).content
    if ((role === "user" || role === "assistant") && typeof content === "string") {
      messages.push({ role, content })
    }
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No valid messages" }, { status: 400 })
  }

  const recent = messages.slice(-20)
  const last = recent[recent.length - 1]
  if (!last || last.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from the user" },
      { status: 400 },
    )
  }

  const queryText = last.content.trim()
  if (!queryText) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: chatbot, error: chatbotError } = await supabase
    .from("chatbots")
    .select(
      "chatbot_id, name, description, model_name, temperature, max_tokens, queries, user_id",
    )
    .eq("chatbot_id", chatbotId)
    .eq("user_id", user.id)
    .single()

  if (chatbotError || !chatbot) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  const { data: docs, error: docsError } = await supabase
    .from("documents")
    .select(
      "document_id, file_name, storage_object_path, storage_bucket_id, processing_status",
    )
    .eq("chatbot_id", chatbotId)
    .eq("user_id", user.id)
    .eq("processing_status", "processed")

  if (docsError) {
    return NextResponse.json(
      { error: `Failed to load documents: ${docsError.message}` },
      { status: 500 },
    )
  }

  type IndexedChunk = {
    text: string
    fileName: string
    embedding: number[]
  }

  const allChunks: IndexedChunk[] = []

  for (const doc of docs ?? []) {
    const bucket = doc.storage_bucket_id || DOCUMENTS_BUCKET
    const sidecarPath = `${doc.storage_object_path}.chunks.json`
    const { data: blob, error: dlError } = await supabase.storage
      .from(bucket)
      .download(sidecarPath)

    if (dlError || !blob) continue

    const text = await blob.text()
    const sidecar = parseChunksSidecar(text)
    if (!sidecar?.chunks?.length) continue

    for (const c of sidecar.chunks) {
      if (
        typeof c.text === "string" &&
        Array.isArray(c.embedding) &&
        c.embedding.length > 0
      ) {
        allChunks.push({
          text: c.text,
          fileName: doc.file_name,
          embedding: c.embedding,
        })
      }
    }
  }

  if (allChunks.length === 0) {
    return NextResponse.json(
      {
        error:
          "No searchable chunks found. Upload and process documents first (chunk files may be missing from storage).",
      },
      { status: 400 },
    )
  }

  const embeddingDims = getEmbeddingDimensions()
  const google = createGoogleGenerativeAI({ apiKey })

  const { embedding: queryEmbeddingRaw } = await embed({
    model: google.embedding(GEMINI_EMBEDDING_MODEL_ID),
    value: queryText,
    providerOptions: {
      google: {
        outputDimensionality: embeddingDims,
        taskType: "RETRIEVAL_QUERY",
      },
    },
  })

  const queryVec = Array.from(queryEmbeddingRaw)

  const scored = allChunks
    .filter((c) => c.embedding.length === queryVec.length)
    .map((c) => ({
      ...c,
      score: cosineSimilarity(queryVec, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K_CHUNKS)

  if (scored.length === 0) {
    return NextResponse.json(
      {
        error:
          "Embedding dimension mismatch between stored chunks and query. Re-index documents or fix EMBEDDING_DIMENSIONS.",
      },
      { status: 500 },
    )
  }

  const contextBlock = scored
    .map(
      (c, i) =>
        `### Snippet ${i + 1} (source: ${c.fileName})\n${c.text.trim()}`,
    )
    .join("\n\n")

  const system = `You are "${chatbot.name}", a helpful assistant that answers questions using ONLY the context below.

${chatbot.description ? `About this assistant: ${chatbot.description}\n\n` : ""}Rules:
- Base your answer strictly on the provided snippets. If they are insufficient, say you could not find that in the uploaded documents.
- When relevant, mention which source file the information comes from.
- Be concise and clear.

--- CONTEXT START ---
${contextBlock}
--- CONTEXT END ---`

  const chatModelId = resolveGeminiChatModelId(chatbot.model_name)
  const temperature = chatbot.temperature ?? 0.7
  const maxOutputTokens = chatbot.max_tokens ?? 2048

  const { text: reply, finishReason } = await generateText({
    model: google(chatModelId),
    system,
    messages: recent.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    temperature,
    maxOutputTokens,
  })

  void supabase
    .from("chatbots")
    .update({ queries: (chatbot.queries ?? 0) + 1 })
    .eq("chatbot_id", chatbotId)

  return NextResponse.json({
    reply,
    finishReason,
    sources: scored.map((s) => ({ fileName: s.fileName, score: s.score })),
  })
}
