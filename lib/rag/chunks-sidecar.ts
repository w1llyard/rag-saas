export type ChunksSidecar = {
  model?: string
  outputDimensionality?: number
  document_id?: number
  chunkCount?: number
  chunks: Array<{
    index: number
    text: string
    embedding: number[]
  }>
}

export function parseChunksSidecar(json: string): ChunksSidecar | null {
  try {
    const data = JSON.parse(json) as unknown
    if (!data || typeof data !== "object") return null
    const chunks = (data as ChunksSidecar).chunks
    if (!Array.isArray(chunks)) return null
    return data as ChunksSidecar
  } catch {
    return null
  }
}
