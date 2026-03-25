/** Supabase Storage bucket for chatbot files and *.chunks.json sidecars. */
export const DOCUMENTS_BUCKET =
  process.env.SUPABASE_DOCUMENTS_BUCKET ?? "chatbot_documents"

export const GEMINI_EMBEDDING_MODEL_ID =
  process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001"

/** Must match Postgres `vector(N)` and Gemini `outputDimensionality`. */
export function getEmbeddingDimensions(): number {
  const n = Number.parseInt(process.env.EMBEDDING_DIMENSIONS ?? "1536", 10)
  return Number.isFinite(n) && n > 0 ? n : 1536
}
