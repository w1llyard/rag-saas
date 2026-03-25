import type { Database } from '@/lib/supabase/supabase.types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

type Row = Database['public']['Tables']['profiles']['Row'];
type Insert = Database['public']['Tables']['profiles']['Insert'];
type Update = Database['public']['Tables']['profiles']['Update'];

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('user_id', userId).single<Row>();
}

export async function createProfile(payload: Insert) {
  return supabase.from('profiles').insert(payload).select().single();
}

export async function updateProfile(userId: string, payload: Update) {
  return supabase.from('profiles').update(payload).eq('user_id', userId).select().single();
}

export async function deleteProfile(userId: string) {
  return supabase.from('profiles').delete().eq('user_id', userId);
}
