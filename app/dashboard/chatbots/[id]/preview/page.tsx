"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Bot, Send, User, RefreshCw, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DashboardShell } from "@/components/dashboard-shell"
import { useUserStore } from "@/store/user-store"
import { getChatbotById } from "@/queries/chatbot"
import { getDocumentsByChatbot } from "@/queries/document"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

function buildWelcomeMessage(chatbotName: string): Message {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    content: `Hi! I'm ${chatbotName}. Ask me anything based on your uploaded documents.`,
    timestamp: new Date().toISOString(),
  }
}

export default function ChatbotPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const chatbotId = params.id as string
  const numericId = Number(chatbotId)
  const idValid = Number.isFinite(numericId)
  const { userData: user, isAuthenticated } = useUserStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: chatbot, isLoading: chatbotLoading, isError: chatbotError } = useQuery({
    queryKey: ["chatbot", chatbotId],
    queryFn: async () => {
      const { data, error } = await getChatbotById(numericId)
      if (error) throw error
      if (!data) throw new Error("Not found")
      return data
    },
    enabled: !!user && isAuthenticated && idValid,
  })

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", chatbotId],
    queryFn: async () => {
      const { data, error } = await getDocumentsByChatbot(numericId)
      if (error) throw error
      return data ?? []
    },
    enabled: !!user && isAuthenticated && idValid,
  })

  const processedDocCount = documents.filter((d) => d.processing_status === "processed").length

  useEffect(() => {
    if (chatbot) {
      setMessages([buildWelcomeMessage(chatbot.name)])
      setChatError(null)
    }
  }, [chatbot?.chatbot_id, chatbot?.name])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [chatbot])

  const handleReset = useCallback(() => {
    if (chatbot) {
      setMessages([buildWelcomeMessage(chatbot.name)])
      setChatError(null)
    }
    inputRef.current?.focus()
  }, [chatbot])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !idValid) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput("")
    setIsLoading(true)
    setChatError(null)

    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = (await res.json()) as { reply?: string; error?: string }

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      if (!data.reply?.trim()) {
        throw new Error("Empty response from assistant")
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply!,
          timestamp: new Date().toISOString(),
        },
      ])
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setChatError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const exportConversation = () => {
    const text = messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chatbot-${chatbotId}-preview.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!idValid) {
    return (
      <DashboardShell>
        <p className="text-muted-foreground">Invalid chatbot link.</p>
      </DashboardShell>
    )
  }

  if (!user || !isAuthenticated) {
    return (
      <DashboardShell>
        <p className="text-muted-foreground">Sign in to use the preview.</p>
      </DashboardShell>
    )
  }

  if (chatbotLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    )
  }

  if (chatbotError || !chatbot) {
    return (
      <DashboardShell>
        <p className="text-muted-foreground">Chatbot not found or you don&apos;t have access.</p>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Chatbot Preview</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              RAG answers from your processed documents (Gemini + embeddings)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 sm:h-10" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset Chat</span>
            <span className="sm:hidden">Reset</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 sm:h-10" onClick={exportConversation}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Conversation</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)]">
            <CardHeader className="border-b p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="size-6 sm:size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <Bot className="size-3 sm:size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base">{chatbot.name}</CardTitle>
                  <CardDescription className="text-xs">Chatbot ID: {chatbotId}</CardDescription>
                </div>
                <Badge variant="outline" className="ml-auto text-xs">
                  Preview Mode
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatError ? (
                  <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3" role="alert">
                    {chatError}
                  </p>
                ) : null}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 items-start ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {message.role === "assistant" && (
                      <div className="size-6 sm:size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <Bot className="size-3 sm:size-4" />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-2 sm:p-3 text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] ${
                        message.role === "user"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className="mt-1 text-[10px] sm:text-xs opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="size-6 sm:size-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        <User className="size-3 sm:size-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 sm:gap-3 items-start">
                    <div className="size-6 sm:size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Bot className="size-3 sm:size-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
                      <div className="flex space-x-1 sm:space-x-2">
                        <div className="size-1.5 sm:size-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="size-1.5 sm:size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="size-1.5 sm:size-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <Separator />
              <form onSubmit={handleSubmit} className="p-2 sm:p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      processedDocCount === 0
                        ? "Upload processed documents first…"
                        : "Ask a question about your documents…"
                    }
                    className="flex-1 h-9 sm:h-10 text-sm"
                    disabled={isLoading || processedDocCount === 0}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 sm:h-10"
                    disabled={isLoading || !input.trim() || processedDocCount === 0}
                  >
                    <Send className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base sm:text-lg">Chatbot Information</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Details about this chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Model</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {chatbot.model_name ?? "gemini-2.0-flash"}
                </p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Documents</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {processedDocCount} processed ({documents.length} total)
                </p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Temperature</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{chatbot.temperature ?? 0.7}</p>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Max output tokens</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{chatbot.max_tokens ?? 2048}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-9 sm:h-10"
                onClick={() => router.push(`/dashboard/chatbots/${chatbotId}`)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Chatbot
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base sm:text-lg">Testing Tips</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Answers use the top matching text chunks from your files</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Rephrase if the model says the context doesn&apos;t contain the answer</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Upload more documents on the chatbot detail page if coverage is thin</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
