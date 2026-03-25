import { create } from "zustand";
import { Database, Tables } from "@/lib/supabase/supabase.types";

export type UserData = Tables<"profiles"> & {
  preferences: Tables<"user_preferences"> | null;
};


interface UserState {
  userData: UserData | null;
  isLoading: boolean; // To know if we are still fetching the initial user
  isAuthenticated: boolean; // Derived state for convenience
  setUser: (user: UserData | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userData: null,
  isLoading: true, // Start with loading true
  isAuthenticated: false,
  setUser: (user) =>
    set({ userData: user, isAuthenticated: !!user, isLoading: false }),
  clearUser: () =>
    set({ userData: null, isAuthenticated: false, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
