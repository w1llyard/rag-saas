"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GOOGLE_GENERATIVE_AI_MODEL_IDS } from "@/lib/ai/google-generative-ai-model-ids"

type GoogleGenerativeAIModelSelectProps = {
  value: string
  onValueChange: (value: string) => void
  id?: string
  disabled?: boolean
  triggerClassName?: string
}

export function GoogleGenerativeAIModelSelect({
  value,
  onValueChange,
  id,
  disabled,
  triggerClassName,
}: GoogleGenerativeAIModelSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        id={id}
        className={triggerClassName ?? "font-mono text-xs sm:text-sm"}
      >
        <SelectValue placeholder="Select a Gemini / Gemma model" />
      </SelectTrigger>
      <SelectContent className="max-h-[min(22rem,65vh)]">
        {GOOGLE_GENERATIVE_AI_MODEL_IDS.map((modelId) => (
          <SelectItem
            key={modelId}
            value={modelId}
            className="font-mono text-xs"
          >
            {modelId}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
