// app/auth/callback/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/auth/loading"

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=Missing%20code", request.url), { status: 303 })
  }

  const supabase = createClient()
  const { error } = await (await supabase).auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(
      new URL("/auth?error=" + encodeURIComponent(error.message), request.url),
      { status: 303 }
    )
  }

  return NextResponse.redirect(new URL(next, request.url), { status: 303 })
}
