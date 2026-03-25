import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Row = Database['public']['Tables']['chatbots']['Row'];
type Insert = Database['public']['Tables']['chatbots']['Insert'];
type Update = Database['public']['Tables']['chatbots']['Update'];

export async function getChatbotById(chatbotId: number) {
  return supabase.from('chatbots').select('*').eq('chatbot_id', chatbotId).single<Row>();
}

export async function getUserChatbots(userId: string) {
  return supabase.from('chatbots').select<'*', Row>('*').eq('user_id', userId);
}

export async function createChatbot(payload: Insert) {
  return supabase.from('chatbots').insert(payload).select('chatbot_id').single();
}

export async function updateChatbot(chatbotId: number, payload: Update) {
  return supabase.from('chatbots').update(payload).eq('chatbot_id', chatbotId);
}

export async function deleteChatbot(chatbotId: number) {
  return supabase.from('chatbots').delete().eq('chatbot_id', chatbotId);
}
