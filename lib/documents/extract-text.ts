import type { Buffer } from "node:buffer"

import { PDFParse } from "pdf-parse"

export type ExtractedDocument = {
  text: string
  pageCount: number | null
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
  fileName: string,
): Promise<ExtractedDocument> {
  const lower = fileName.toLowerCase()

  if (
    lower.endsWith(".txt") ||
    lower.endsWith(".md") ||
    mimeType === "text/plain" ||
    mimeType === "text/markdown"
  ) {
    return { text: buffer.toString("utf-8"), pageCount: null }
  }

  if (lower.endsWith(".pdf") || mimeType === "application/pdf") {
    const parser = new PDFParse({ data: buffer })
    try {
      const result = await parser.getText()
      const pageCount = result.total > 0 ? result.total : result.pages.length
      return { text: result.text ?? "", pageCount }
    } finally {
      await parser.destroy()
    }
  }

  throw new Error(`Unsupported file type: ${mimeType || lower}`)
}
