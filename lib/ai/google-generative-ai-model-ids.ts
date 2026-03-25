/**
 * Literal model ids aligned with `GoogleGenerativeAIModelId` in `@ai-sdk/google`
 * (language / multimodal chat models). Update when upgrading the SDK.
 *
 * @see https://www.npmjs.com/package/@ai-sdk/google
 */
export const GOOGLE_GENERATIVE_AI_MODEL_IDS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash-lite-preview-09-2025",
  "gemini-2.5-flash-preview-tts",
  "gemini-2.5-pro-preview-tts",
  "gemini-2.5-flash-native-audio-latest",
  "gemini-2.5-flash-native-audio-preview-09-2025",
  "gemini-2.5-flash-native-audio-preview-12-2025",
  "gemini-2.5-computer-use-preview-10-2025",
  "gemini-3-pro-preview",
  "gemini-3-pro-image-preview",
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
  "gemini-3.1-pro-preview-customtools",
  "gemini-3.1-flash-image-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-pro-latest",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "deep-research-pro-preview-12-2025",
  "nano-banana-pro-preview",
  "aqa",
  "gemini-robotics-er-1.5-preview",
  "gemma-3-1b-it",
  "gemma-3-4b-it",
  "gemma-3n-e4b-it",
  "gemma-3n-e2b-it",
  "gemma-3-12b-it",
  "gemma-3-27b-it",
] as const

export type GoogleGenerativeAIModelId =
  (typeof GOOGLE_GENERATIVE_AI_MODEL_IDS)[number]

export const DEFAULT_GOOGLE_CHAT_MODEL_ID: GoogleGenerativeAIModelId =
  "gemini-2.0-flash"

const ID_SET = new Set<string>(GOOGLE_GENERATIVE_AI_MODEL_IDS)

export function isGoogleGenerativeAIModelId(
  id: string,
): id is GoogleGenerativeAIModelId {
  return ID_SET.has(id)
}
