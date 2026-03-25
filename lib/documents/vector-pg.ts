/** Mean-pool multiple same-dimension vectors (document-level embedding). */
export function meanPoolEmbeddings(vectors: number[][]): number[] {
  if (vectors.length === 0) return []
  const dim = vectors[0].length
  const acc = new Array(dim).fill(0)
  for (const v of vectors) {
    for (let i = 0; i < dim; i++) {
      acc[i] += v[i] ?? 0
    }
  }
  const n = vectors.length
  for (let i = 0; i < dim; i++) acc[i] /= n
  return acc
}

/**
 * pgvector text input for PostgREST / Supabase (e.g. vector(768)).
 * @see https://supabase.com/docs/guides/ai/vector-columns
 */
export function toPgvectorLiteral(vector: number[]): string {
  return `[${vector.map((x) => (Number.isFinite(x) ? x : 0)).join(",")}]`
}
