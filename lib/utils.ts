import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createBrowserClient } from '@supabase/ssr'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
