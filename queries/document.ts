import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Row = Database['public']['Tables']['documents']['Row'];
type Insert = Database['public']['Tables']['documents']['Insert'];
type Update = Database['public']['Tables']['documents']['Update'];

export async function getDocumentById(documentId: number) {
  return supabase.from('documents').select('*').eq('document_id', documentId).single();
}

export async function getDocumentsByChatbot(chatbotId: number) {
  return supabase.from('documents').select('*').eq('chatbot_id', chatbotId);
}

export async function getDocumentsByUser(userId: string) {
  return supabase.from('documents').select('*').eq('user_id', userId);
}

export async function createDocument(payload: Insert) {
  return supabase.from('documents').insert(payload).select().single();
}

export async function updateDocument(documentId: number, payload: Update) {
  return supabase.from('documents').update(payload).eq('document_id', documentId).select().single();
}

export async function deleteDocument(documentId: number) {
  return supabase.from('documents').delete().eq('document_id', documentId);
}
