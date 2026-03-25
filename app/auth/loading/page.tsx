"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const didRunRef = useRef(false)

  useEffect(() => {
    if (didRunRef.current) return
    didRunRef.current = true

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleAuthCallback = async () => {
      setTimeout(() => {
        router.replace("/dashboard")
      }, 2500)
    }

    handleAuthCallback()

    // Clean up any pending timeout if the component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
        <div>
          <h2 className="text-xl font-semibold">Completing sign in...</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we set up your account
          </p>
        </div>
      </div>
    </div>
  )
}
