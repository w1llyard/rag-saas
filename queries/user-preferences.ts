import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Row = Database['public']['Tables']['user_preferences']['Row'];
type Insert = Database['public']['Tables']['user_preferences']['Insert'];
type Update = Database['public']['Tables']['user_preferences']['Update'];

export async function getUserPreferences(userId: string) {
  return supabase.from('user_preferences').select('*').eq('user_id', userId).single<Row>();
}

export async function createUserPreferences(payload: Insert) {
  return supabase.from('user_preferences').insert(payload).select().single();
}

export async function updateUserPreferences(userId: string, payload: Update) {
  return supabase.from('user_preferences').update(payload).eq('user_id', userId).select().single();
}

export async function deleteUserPreferences(userId: string) {
  return supabase.from('user_preferences').delete().eq('user_id', userId);
}
