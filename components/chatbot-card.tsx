"use client"
import { Bot, MessageSquare, FileText, Clock, MoreHorizontal, ExternalLink, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatbotSummary } from "@/services/types/chatbot-summary.interface"
import {diffInDays} from '@/utils/utils'

interface ChatbotCardProps {
  chatbot: ChatbotSummary
  onClick: () => void
}

export function ChatbotCard({ chatbot, onClick }: ChatbotCardProps) {
  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Top: avatar + text + status badge */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-9 sm:size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
              <Bot className="size-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate">{chatbot.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 sm:line-clamp-1">
                {chatbot.description}
              </p>
            </div>
          </div>

          <div className="sm:ml-4">
            <Badge
              className="self-start w-fit"
              variant={chatbot.status === "active" ? "default" : "secondary"}
            >
              {chatbot.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* Footer: stats + actions */}
      <CardFooter className="bg-muted/50 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Stats wrap on small screens, single line on larger */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="size-4" />
              <span>{chatbot.queries}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="size-4" />
              <span>{chatbot.documents}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">{diffInDays(chatbot.lastUpdated, new Date())+ ' days ago'}</span>
            </div>
          </div>

          {/* Actions stay to the right on larger screens, drop below on mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => e.stopPropagation()}
              aria-label="Preview"
            >
              <ExternalLink className="size-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="More">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Preview</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
