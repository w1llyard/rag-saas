"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  ChevronDown,
  FileText,
  BarChart3,
  Bot,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DashboardShell } from "@/components/dashboard-shell";
import { CreateChatbotForm, type CreateChatbotFormPayload } from "@/components/create-chatbot-form";
import { createChatbot } from "@/queries/chatbot";
import { ChatbotCard } from "@/components/chatbot-card";
import { useUserStore } from "@/store/user-store";
import Loading from "@/components/loading";
import { getUserChatbotSummary } from "@/services/chatbot-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function DashboardPage() {
  const { userData: user, isAuthenticated } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: chatbotSummaryList, isLoading } = useQuery({
    queryKey: ["chatbots", user?.user_id],
    queryFn: () => getUserChatbotSummary(user!.user_id),
    enabled: !!user && isAuthenticated,
    initialData: [],
  });

  const filteredChatbots = chatbotSummaryList?.filter(
    (chatbot) =>
      chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chatbot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQueries = chatbotSummaryList?.reduce(
    (sum, chatbot) => sum + chatbot.queries,
    0
  );
  const totalDocuments = chatbotSummaryList?.reduce(
    (sum, chatbot) => sum + chatbot.documents,
    0
  );
  const activeChatbots = chatbotSummaryList?.filter(
    (chatbot) => chatbot.status === "active"
  ).length;

  const handleCreateChatbot = async (data: CreateChatbotFormPayload) => {
    if (!user) return;
    const { data: row, error } = await createChatbot({
      name: data.name,
      description: data.description.trim() ? data.description : null,
      user_id: user.user_id,
      model_name: data.model_name,
      status: "active",
    });
    if (error) {
      console.error(error);
      return;
    }
    setIsCreateDialogOpen(false);
    await queryClient.invalidateQueries({ queryKey: ["chatbots", user.user_id] });
    if (row?.chatbot_id != null) {
      router.push(`/dashboard/chatbots/${row.chatbot_id}`);
    }
  };

  const handleChatbotClick = (id: number) => {
    router.push(`/dashboard/chatbots/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbots</h1>
          <p className="text-muted-foreground">
            Create and manage your AI chatbots
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Chatbot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Chatbot</DialogTitle>
              <DialogDescription>
                Create a new AI chatbot trained on your documents. You can add
                documents after creating the chatbot.
              </DialogDescription>
            </DialogHeader>
            <CreateChatbotForm onSubmit={handleCreateChatbot} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Chatbots
            </CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chatbotSummaryList?.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeChatbots} active,{" "}
              {chatbotSummaryList?.length - activeChatbots} inactive
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalQueries.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 100)} from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Across all chatbots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <Progress value={42} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Of your monthly quota
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chatbots..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Status
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>Active</DropdownMenuItem>
            <DropdownMenuItem>Inactive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              Sort
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Newest</DropdownMenuItem>
            <DropdownMenuItem>Oldest</DropdownMenuItem>
            <DropdownMenuItem>Most queries</DropdownMenuItem>
            <DropdownMenuItem>Recently updated</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredChatbots.map((chatbot) => (
          <ChatbotCard
            key={chatbot.id}
            chatbot={chatbot}
            onClick={() => handleChatbotClick(chatbot.id)}
          />
        ))}
      </div>
    </DashboardShell>
  );
}
