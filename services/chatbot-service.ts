import { getUserChatbots } from '@/queries/chatbot';
import { ChatbotSummary } from './types/chatbot-summary.interface';

export const getUserChatbotSummary = async (userId: string) : Promise<ChatbotSummary[]> => {
  const { data, error } = await getUserChatbots(userId);
  if (error) throw new Error(error.message);

  return data.map((item) => ({
    id: item.chatbot_id,
    name: item.name,
    description: item.description,
    documents: 0,
    queries: item.queries,
    status: item.status,
    lastUpdated: new Date(item.updated_at ?? ''),
  })) as ChatbotSummary[];  
}