"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  FileText,
  Upload,
  Settings,
  Code,
  BarChart3,
  ChevronDown,
  Trash2,
  Download,
  ExternalLink,
  Copy,
  Check,
  Bot,
  MessageSquare,
  Clock,
  FileUp,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardShell } from "@/components/dashboard-shell"
import { DocumentCard } from "@/components/document-card"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { useUserStore } from "@/store/user-store"
import { getChatbotById } from "@/queries/chatbot"
import { getDocumentsByChatbot } from "@/queries/document"
import { mapDocumentRowToCard } from "@/lib/documents/document-ui"
import { GoogleGenerativeAIModelSelect } from "@/components/google-generative-ai-model-select"
import { DEFAULT_GOOGLE_CHAT_MODEL_ID } from "@/lib/ai/google-generative-ai-model-ids"
import { resolveGeminiChatModelId } from "@/lib/rag/resolve-chat-model"

// Mock data for analytics
const mockAnalytics = {
  queriesOverTime: [120, 145, 132, 165, 178, 156, 198, 187, 210, 232, 245, 256, 278, 290, 310],
  topQueries: [
    { query: "How do I install the product?", count: 87 },
    { query: "What are the system requirements?", count: 65 },
    { query: "How do I reset my password?", count: 52 },
    { query: "Is there a mobile app?", count: 43 },
    { query: "How do I export my data?", count: 38 },
  ],
  responseRate: 98.5,
  averageResponseTime: "1.2s",
}

export default function ChatbotDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const chatbotId = params.id as string
  const numericChatbotId = Number(chatbotId)
  const idValid = Number.isFinite(numericChatbotId)
  const { userData: user, isAuthenticated } = useUserStore()

  const [activeTab, setActiveTab] = useState("documents")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [copiedEmbed, setCopiedEmbed] = useState(false)
  const [chatbotSettings, setChatbotSettings] = useState<{
    name: string
    description: string
    model_name: string
    temperature: number
    maxTokens: number
    status: boolean
  }>({
    name: "",
    description: "",
    model_name: DEFAULT_GOOGLE_CHAT_MODEL_ID,
    temperature: 0.7,
    maxTokens: 1024,
    status: true,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: chatbot, isLoading: chatbotLoading, isError: chatbotError } = useQuery({
    queryKey: ["chatbot", chatbotId],
    queryFn: async () => {
      const { data, error } = await getChatbotById(numericChatbotId)
      if (error) throw error
      if (!data) throw new Error("Chatbot not found")
      return data
    },
    enabled: !!user && isAuthenticated && idValid,
  })

  const { data: documentsData = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["documents", chatbotId],
    queryFn: async () => {
      const { data, error } = await getDocumentsByChatbot(numericChatbotId)
      if (error) throw error
      return data ?? []
    },
    enabled: !!user && isAuthenticated && idValid,
  })

  const embedCode = useMemo(
    () => `<script src="https://cdn.ragsaas.com/widget.js"></script>
<script>
  window.ragWidget.init({
    chatbotId: "${chatbotId}",
    position: "bottom-right",
    theme: "light",
    primaryColor: "#9333ea"
  });
</script>`,
    [chatbotId],
  )

  useEffect(() => {
    if (!chatbot) return
    setChatbotSettings({
      name: chatbot.name,
      description: chatbot.description ?? "",
      model_name: resolveGeminiChatModelId(chatbot.model_name),
      temperature: chatbot.temperature ?? 0.7,
      maxTokens: chatbot.max_tokens ?? 1024,
      status: chatbot.status === "active",
    })
  }, [chatbot])

  const documentCards = documentsData.map(mapDocumentRowToCard)
  const processedCount = documentsData.filter((d) => d.processing_status === "processed").length

  const lastUpdatedLabel = (() => {
    const raw =
      chatbot?.last_document_or_setting_change_at ?? chatbot?.updated_at ?? chatbot?.created_at
    if (!raw) return "—"
    try {
      return formatDistanceToNow(new Date(raw), { addSuffix: true })
    } catch {
      return "—"
    }
  })()

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length || !idValid) return

    setIsUploading(true)
    setUploadError(null)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch(`/api/chatbots/${chatbotId}/documents`, {
          method: "POST",
          body: formData,
        })
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        if (!res.ok) {
          throw new Error(json.error || `Upload failed (${res.status})`)
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["documents", chatbotId] })
      await queryClient.invalidateQueries({ queryKey: ["chatbots", user?.user_id] })
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode)
    setCopiedEmbed(true)
    setTimeout(() => setCopiedEmbed(false), 2000)
  }

  const handleSettingsChange = (key: string, value: any) => {
    setChatbotSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
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
        <p className="text-muted-foreground">Sign in to manage this chatbot.</p>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{chatbot.name}</h1>
            <Badge variant={chatbot.status === "active" ? "default" : "secondary"} className="ml-2">
              {chatbot.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{chatbot.description ?? "—"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/chatbots/${chatbotId}/preview`)}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                More
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Chatbot
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbot.queries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(Math.random() * 100)} from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsData.length}</div>
            <p className="text-xs text-muted-foreground">{processedCount} processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.responseRate}%</div>
            <p className="text-xs text-muted-foreground">Successful responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastUpdatedLabel}</div>
            <p className="text-xs text-muted-foreground">Last document or setting change</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            Customize & Embed
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Documents</h2>
            <Button onClick={handleUploadClick} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </>
              )}
            </Button>
          </div>

          {uploadError ? (
            <p className="text-sm text-destructive" role="alert">
              {uploadError}
            </p>
          ) : null}

          {documentsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4">
              {documentCards.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          )}

          {!documentsLoading && documentCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-muted-foreground mb-4">Upload documents to train your chatbot</p>
              <Button onClick={handleUploadClick}>Upload Documents</Button>
            </div>
          )}
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.txt,.md"
            className="hidden"
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your chatbot's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={chatbotSettings.name}
                  onChange={(e) => handleSettingsChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={chatbotSettings.description}
                  onChange={(e) => handleSettingsChange("description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={chatbotSettings.status}
                  onCheckedChange={(checked) => handleSettingsChange("status", checked)}
                />
                <Label htmlFor="status">Active</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Settings</CardTitle>
              <CardDescription>Configure the AI model for your chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model_name">Model</Label>
                <GoogleGenerativeAIModelSelect
                  id="model_name"
                  value={chatbotSettings.model_name}
                  onValueChange={(value) => handleSettingsChange("model_name", value)}
                />
                <p className="text-xs text-muted-foreground">
                  Model id passed to <code className="text-[10px]">@ai-sdk/google</code> for chat.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {chatbotSettings.temperature}</Label>
                  <span className="text-sm text-muted-foreground">Controls randomness</span>
                </div>
                <Input
                  id="temperature"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={chatbotSettings.temperature}
                  onChange={(e) => handleSettingsChange("temperature", Number.parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Precise (0)</span>
                  <span>Creative (1)</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={chatbotSettings.maxTokens}
                  onChange={(e) => handleSettingsChange("maxTokens", Number.parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">Maximum length of the generated response</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customize & Embed Your Chatbot</CardTitle>
              <CardDescription>Personalize your chatbot's appearance and add it to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                  {embedCode}
                </pre>
                <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={handleCopyEmbed}>
                  {copiedEmbed ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="position">Widget Position</Label>
                <Select defaultValue="bottom-right">
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="theme">Widget Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input id="color" type="color" defaultValue="#9333ea" className="w-12 p-1 h-10" />
                  <Input defaultValue="#9333ea" className="flex-1" />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="chatTitle">Chat Title</Label>
                <Input
                  id="chatTitle"
                  defaultValue={chatbotSettings.name}
                  placeholder="Enter a title for your chat widget"
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  defaultValue={`Hello! I'm ${chatbotSettings.name}. How can I help you today?`}
                  placeholder="Enter a welcome message"
                  rows={3}
                />
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input id="buttonText" defaultValue="Chat with us" placeholder="Text for the chat button" />
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <Label htmlFor="avatarEnabled">Show Bot Avatar</Label>
                  <Switch id="avatarEnabled" defaultChecked />
                </div>
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoOpen">Auto-open on Page Load</Label>
                  <Switch id="autoOpen" />
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 mt-2">Update Embed Code</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your chatbot will appear on your website</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-6 border-t">
              <div className="relative w-full max-w-sm h-[400px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <div className="p-4 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-md bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      R
                    </div>
                    <span className="font-medium text-sm">{chatbotSettings.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 flex flex-col gap-4 h-[300px] overflow-y-auto">
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm max-w-[80%]">
                      <p>Hello! I'm your product documentation assistant. How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start justify-end">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-lg p-3 text-sm max-w-[80%]">
                      <p>How do I install the product?</p>
                    </div>
                    <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      <span className="text-xs font-medium">U</span>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Bot className="size-4" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm max-w-[80%]">
                      <p>
                        Based on our documentation, you can install the product by following these steps:
                        <br />
                        <br />
                        1. Download the installer from your account dashboard
                        <br />
                        2. Run the installer as administrator
                        <br />
                        3. Follow the on-screen instructions
                        <br />
                        4. Enter your license key when prompted
                        <br />
                        5. Complete the installation
                        <br />
                        <br />
                        For more detailed instructions, please refer to the Installation Guide in the documentation.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-gray-900">
                  <div className="relative">
                    <Input placeholder="Ask a question..." className="pr-10 rounded-full" />
                    <Button
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-purple-600 hover:bg-purple-700"
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Over Time</CardTitle>
              <CardDescription>Number of queries per day over the last 15 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <div className="flex items-end justify-between h-full w-full gap-2">
                  {mockAnalytics.queriesOverTime.map((value, i) => (
                    <div key={i} className="relative group flex flex-col items-center">
                      <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-2 py-1">
                        {value} queries
                      </div>
                      <div
                        className="w-5 bg-purple-600 hover:bg-purple-500 rounded-t transition-all"
                        style={{
                          height: `${(value / Math.max(...mockAnalytics.queriesOverTime)) * 100}%`,
                        }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-1">{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Queries</CardTitle>
              <CardDescription>Most frequent questions asked by users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topQueries.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                        {i + 1}
                      </Badge>
                      <span>{item.query}</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Rate</CardTitle>
                <CardDescription>Percentage of queries that received a response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold text-purple-600">{mockAnalytics.responseRate}%</div>
                  <Progress value={mockAnalytics.responseRate} className="w-full mt-4" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Response Time</CardTitle>
                <CardDescription>Time taken to generate a response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold text-purple-600">{mockAnalytics.averageResponseTime}</div>
                  <p className="text-muted-foreground mt-2">seconds per response</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
