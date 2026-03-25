import createClient from "@/lib/supabase/client"
import { useUserStore } from "@/store/user-store"

/** Browser sign-out: clears Supabase session and local user store. */
export async function clientSignOut(): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut({ scope: "global" })
  useUserStore.getState().clearUser()
  return { error: error?.message ?? null }
}
