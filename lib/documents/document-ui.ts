import { format } from "date-fns"
import type { Tables } from "@/lib/supabase/supabase.types"

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

export type DocumentCardModel = {
  id: string
  name: string
  size: string
  pages: number
  uploadedAt: string
  status: string
}

export function mapDocumentRowToCard(row: Tables<"documents">): DocumentCardModel {
  const status = row.processing_status
  const uiStatus =
    status === "processed"
      ? "processed"
      : status === "failed"
        ? "error"
        : "processing"

  const uploaded = row.uploaded_at ?? row.created_at
  return {
    id: String(row.document_id),
    name: row.file_name,
    size: formatBytes(row.file_size_bytes ?? 0),
    pages: row.page_count ?? 0,
    uploadedAt: uploaded
      ? format(new Date(uploaded), "MMM d, yyyy")
      : "—",
    status: uiStatus,
  }
}
