import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Insert = Database['public']['Tables']['chatbot_embed_settings']['Insert'];
type Update = Database['public']['Tables']['chatbot_embed_settings']['Update'];

export async function getChatbotEmbedSettings(chatbotId: number) {
  return supabase
    .from('chatbot_embed_settings')
    .select('*')
    .eq('chatbot_id', chatbotId)
    .single();
}

export async function createChatbotEmbedSettings(payload: Insert) {
  return supabase
    .from('chatbot_embed_settings')
    .insert(payload)
    .select()
    .single();
}

export async function updateChatbotEmbedSettings(chatbotId: number, payload: Update) {
  return supabase
    .from('chatbot_embed_settings')
    .update(payload)
    .eq('chatbot_id', chatbotId)
    .select()
    .single();
}

export async function deleteChatbotEmbedSettings(chatbotId: number) {
  return supabase
    .from('chatbot_embed_settings')
    .delete()
    .eq('chatbot_id', chatbotId);
}
