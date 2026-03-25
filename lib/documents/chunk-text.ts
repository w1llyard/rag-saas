/** Split plain text into overlapping chunks for embedding. */
export function chunkText(
  text: string,
  maxChunkSize = 1200,
  overlap = 200,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (!normalized.length) return []
  if (normalized.length <= maxChunkSize) return [normalized]

  const chunks: string[] = []
  let start = 0
  while (start < normalized.length) {
    const end = Math.min(start + maxChunkSize, normalized.length)
    chunks.push(normalized.slice(start, end))
    if (end >= normalized.length) break
    start = Math.max(0, end - overlap)
  }
  return chunks
}
