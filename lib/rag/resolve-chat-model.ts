import {
  DEFAULT_GOOGLE_CHAT_MODEL_ID,
  isGoogleGenerativeAIModelId,
} from "@/lib/ai/google-generative-ai-model-ids"

/** Legacy UI values stored before model id picker. */
const LEGACY_MODEL_MAP: Record<string, string> = {
  "gemini-pro": "gemini-2.0-flash",
  "gemini-pro-vision": "gemini-2.0-flash",
  "gemini-ultra": "gemini-2.5-pro",
}

/**
 * Resolve `chatbots.model_name` to a `GoogleGenerativeAIModelId` for `google(...)`.
 */
export function resolveGeminiChatModelId(modelName: string | null | undefined): string {
  const raw = (modelName ?? DEFAULT_GOOGLE_CHAT_MODEL_ID).trim()
  if (!raw) return DEFAULT_GOOGLE_CHAT_MODEL_ID

  const legacy = LEGACY_MODEL_MAP[raw.toLowerCase()]
  if (legacy) return legacy

  if (isGoogleGenerativeAIModelId(raw)) return raw

  return DEFAULT_GOOGLE_CHAT_MODEL_ID
}
