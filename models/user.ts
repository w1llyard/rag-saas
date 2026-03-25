// models/User.ts

export interface AppUser {
    id: string
    aud: string
    role: string
    email?: string | null
    phone?: string | null
    confirmed_at?: string | null
    last_sign_in_at?: string | null
    app_metadata?: {
      provider?: string
      [key: string]: any
    }
    user_metadata?: {
      [key: string]: any
    }
    created_at: string
    updated_at: string
  }
