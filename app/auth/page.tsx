"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Github, Mail, Lock, User, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import createClient from "@/lib/supabase/client"
import { useUserStore } from "@/store/user-store"
import { createUser } from "@/services/user-service"

type AuthMode = "signin" | "signup" | "forgot-password"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const { setUser } = useUserStore()

  useEffect(() => {
    const mode = searchParams.get("mode")
    if (mode === "signup" || mode === "forgot-password") {
      setMode(mode as AuthMode)
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required")
      return false
    }

    if (mode !== "forgot-password" && !formData.password) {
      setError("Password is required")
      return false
    }

    if (mode === "signup") {
      if (!formData.fullName) {
        setError("Full name is required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    }

    return true
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        if (data.user) {
          router.push("/auth/loading")
        }
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.fullName,
            },
          },
        });
      
        if (error) throw error;
      
        if (data.user) {
          // Create a profile in the database
          try {
            createUser(
              {
                user_id: data.user.id,
                name: formData.fullName,
                email: formData.email,
                profile_picture_url: null,
                current_plan_id: null,
              },{
                user_id: data.user.id,
              }
            );
          } catch (error) {
            if (error) {
              setError("Your account was created, but we couldn't set up your profile. Please contact support.");
              return;
            }
          }        
        }
      
        setSuccess("Check your email for the confirmation link!");
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) throw error

        setSuccess("Password reset email sent! Check your inbox.")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message || "An error occurred")
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    })
    setError("")
    setSuccess("")
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    resetForm()
  }

  const getTitle = () => {
    switch (mode) {
      case "signin":
        return "Welcome back"
      case "signup":
        return "Create your account"
      case "forgot-password":
        return "Reset your password"
    }
  }

  const getDescription = () => {
    switch (mode) {
      case "signin":
        return "Sign in to your account to continue"
      case "signup":
        return "Get started with your free account"
      case "forgot-password":
        return "Enter your email to receive a reset link"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 group"
              >
                <div className="size-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl font-bold">R</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  RAG SaaS
                </h1>
              </Link>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
              <CardDescription className="text-base">
                {getDescription()}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {success}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OAuth Buttons */}
              {mode !== "forgot-password" && (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={loading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={loading}
                  >
                    <Github className="w-5 h-5 mr-3" />
                    Continue with GitHub
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10 h-11"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 h-11"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={loading}
                    />
                  </div>
                </div>

                {mode !== "forgot-password" && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-11"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-11"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "signin" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot-password" && "Send Reset Link"}
                </Button>
              </form>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                {mode === "signin" && (
                  <>
                    <button
                      type="button"
                      className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                      onClick={() => switchMode("forgot-password")}
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                        onClick={() => switchMode("signup")}
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}

                {mode === "signup" && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-purple-600 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-purple-600 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                        onClick={() => switchMode("signin")}
                      >
                        Sign in
                      </button>
                    </p>
                  </>
                )}

                {mode === "forgot-password" && (
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <button
                      type="button"
                      className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                      onClick={() => switchMode("signin")}
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
