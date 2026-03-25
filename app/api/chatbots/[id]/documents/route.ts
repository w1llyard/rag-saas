import { randomUUID } from "node:crypto"

import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { embedMany } from "ai"
import { NextResponse } from "next/server"

import { chunkText } from "@/lib/documents/chunk-text"
import { extractTextFromFile } from "@/lib/documents/extract-text"
import {
  DOCUMENTS_BUCKET,
  GEMINI_EMBEDDING_MODEL_ID,
  getEmbeddingDimensions,
} from "@/lib/ai/embedding-config"
import { meanPoolEmbeddings, toPgvectorLiteral } from "@/lib/documents/vector-pg"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const maxDuration = 120

const BUCKET = DOCUMENTS_BUCKET
const embeddingDims = getEmbeddingDimensions()

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180)
}

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
      {
        error:
          "Server missing GOOGLE_GENERATIVE_AI_API_KEY for Gemini embeddings",
      },
      { status: 503 },
    )
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
    .select("chatbot_id")
    .eq("chatbot_id", chatbotId)
    .eq("user_id", user.id)
    .single()

  if (chatbotError || !chatbot) {
    return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
  }

  const formData = await req.formData()
  const files: File[] = []
  const one = formData.get("file")
  if (one instanceof File && one.size > 0) files.push(one)
  for (const entry of formData.getAll("files")) {
    if (entry instanceof File && entry.size > 0) files.push(entry)
  }

  if (files.length === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const file = files[0]
  const buffer = Buffer.from(await file.arrayBuffer())
  const objectPath = `${user.id}/${chatbotId}/${randomUUID()}-${safeFileName(file.name)}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { error: `Storage upload failed: ${uploadError.message}` },
      { status: 500 },
    )
  }

  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : ""
  const fileType = file.type || ext || "application/octet-stream"

  const { data: docRow, error: insertError } = await supabase
    .from("documents")
    .insert({
      chatbot_id: chatbotId,
      user_id: user.id,
      file_name: file.name,
      file_size_bytes: file.size,
      file_type: fileType,
      storage_object_path: objectPath,
      storage_bucket_id: BUCKET,
      processing_status: "processing",
    })
    .select("document_id")
    .single()

  if (insertError || !docRow) {
    await supabase.storage.from(BUCKET).remove([objectPath])
    return NextResponse.json(
      { error: insertError?.message ?? "Failed to create document row" },
      { status: 500 },
    )
  }

  const documentId = docRow.document_id

  try {
    const { text, pageCount } = await extractTextFromFile(
      buffer,
      file.type || "",
      file.name,
    )
    const trimmed = text.trim()
    if (!trimmed.length) {
      throw new Error("No extractable text in file")
    }

    const chunks = chunkText(trimmed)
    if (chunks.length === 0) {
      throw new Error("Could not chunk document text")
    }

    const google = createGoogleGenerativeAI({ apiKey })
    const { embeddings } = await embedMany({
      model: google.embedding(GEMINI_EMBEDDING_MODEL_ID),
      values: chunks,
      providerOptions: {
        google: {
          outputDimensionality: embeddingDims,
          taskType: "RETRIEVAL_DOCUMENT",
        },
      },
    })

    const chunkVectors = embeddings.map((e) => Array.from(e))
    const documentVector = meanPoolEmbeddings(chunkVectors)
    const embeddingLiteral = toPgvectorLiteral(documentVector)

    const chunksSidecar = JSON.stringify({
      model: GEMINI_EMBEDDING_MODEL_ID,
      outputDimensionality: embeddingDims,
      document_id: documentId,
      chunkCount: chunks.length,
      chunks: chunks.map((content, index) => ({
        index,
        text: content,
        embedding: chunkVectors[index],
      })),
    })

    const chunksPath = `${objectPath}.chunks.json`
    const { error: sidecarError } = await supabase.storage
      .from(BUCKET)
      .upload(chunksPath, new Blob([chunksSidecar], { type: "application/json" }), {
        contentType: "application/json",
        upsert: true,
      })

    if (sidecarError) {
      throw new Error(`Failed to save chunk embeddings: ${sidecarError.message}`)
    }

    const { error: updateError } = await supabase
      .from("documents")
      .update({
        embedding: embeddingLiteral,
        processing_status: "processed",
        page_count: pageCount,
        uploaded_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("document_id", documentId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return NextResponse.json({
      documentId,
      chunks: chunks.length,
      status: "processed",
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed"
    await supabase
      .from("documents")
      .update({
        processing_status: "failed",
        error_message: message,
      })
      .eq("document_id", documentId)

    return NextResponse.json(
      { error: message, documentId },
      { status: 422 },
    )
  }
}
