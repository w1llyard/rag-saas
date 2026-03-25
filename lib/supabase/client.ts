import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"

import { getSupabasePublishableKey, getSupabaseUrl } from "./public-env"

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // Return existing instance if it exists (singleton pattern)
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Create new instance
  supabaseInstance = createBrowserClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
  )

  return supabaseInstance
}

// Default export for backward compatibility
export default createClient
