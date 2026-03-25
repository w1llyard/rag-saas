import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Row = Database['public']['Tables']['user_api_keys']['Row'];
type Insert = Database['public']['Tables']['user_api_keys']['Insert'];
type Update = Database['public']['Tables']['user_api_keys']['Update'];

export async function getApiKeysByUser(userId: string) {
  return supabase.from('user_api_keys').select('*').eq('user_id', userId);
}

export async function createApiKey(payload: Insert) {
  return supabase.from('user_api_keys').insert(payload).select().single();
}

export async function updateApiKey(apiKeyId: number, payload: Update) {
  return supabase.from('user_api_keys').update(payload).eq('api_key_id', apiKeyId).select().single();
}

export async function deleteApiKey(apiKeyId: number) {
  return supabase.from('user_api_keys').delete().eq('api_key_id', apiKeyId);
}
