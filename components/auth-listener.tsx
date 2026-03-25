"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import createClient from "@/lib/supabase/client";
import { getFullUser } from "@/services/user-service";
import { useQuery } from "@tanstack/react-query";

export default function AuthListener() {
  const supabase = createClient();
  const { setUser, clearUser, setLoading } = useUserStore();

  useEffect(() => {
    let mounted = true;

    async function getInitialUser() {
      setLoading(true);

      // Get the auth user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (user) {
        try {
          // Directly fetch the full user profile (no hooks here)
          const fullUser = await getFullUser(user.id);

          // Merge into one object and store
          setUser(fullUser);
        } catch (error) {
          console.log("Error loading profile:", error);
          clearUser();
        }
      } else {
        clearUser();
      }
    }

    getInitialUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (session?.user) {
          try {
            const userData = await getFullUser(session.user.id);
            setUser(userData);
          } catch (error) {
            if (error) {
              console.log("Error loading profile:", error);
              clearUser();
              return;
            }
          }
        } else {
          clearUser();
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, setUser, clearUser, setLoading]);

  return null;
}
