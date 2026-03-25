import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import AuthListener from "@/components/auth-listener"
import Providers from "./providers"
import AppLoader from "@/components/app-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RAG SaaS - Turn Your Documents into Smart AI Chatbots",
  description: "Upload PDFs, TXTs, or Markdown, then ask questions and get context-aware answers powered by Gemini AI.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthListener />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <AppLoader>{children}</AppLoader>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
