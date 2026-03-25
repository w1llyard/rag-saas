"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { GoogleGenerativeAIModelSelect } from "@/components/google-generative-ai-model-select"
import { DEFAULT_GOOGLE_CHAT_MODEL_ID } from "@/lib/ai/google-generative-ai-model-ids"

export type CreateChatbotFormPayload = {
  name: string
  description: string
  model_name: string
}

interface CreateChatbotFormProps {
  onSubmit: (data: CreateChatbotFormPayload) => void
}

export function CreateChatbotForm({ onSubmit }: CreateChatbotFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model_name: DEFAULT_GOOGLE_CHAT_MODEL_ID,
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="My Awesome Chatbot"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="This chatbot helps users with..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="model_name">Model</Label>
          <GoogleGenerativeAIModelSelect
            id="model_name"
            value={formData.model_name}
            onValueChange={(value) => handleChange("model_name", value)}
          />
          <p className="text-sm text-muted-foreground">
            Google Generative AI model id (same identifiers as{" "}
            <code className="text-xs">@ai-sdk/google</code>).
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Create Chatbot
        </Button>
      </DialogFooter>
    </form>
  )
}
