import {
    getProfile,
    createProfile,
    updateProfile,
  } from "@/queries/profile";
  import {
    getUserPreferences,
    createUserPreferences,
    updateUserPreferences,
  } from "@/queries/user-preferences";
  import type { TablesInsert, TablesUpdate } from "@/lib/supabase/supabase.types";
  
  /**
   * Retrieves the full user object including profile and preferences.
   */
  export async function getFullUser(userId: string) {
    const [profileRes, prefsRes] = await Promise.all([
      getProfile(userId),
      getUserPreferences(userId),
    ]);
  

    if (profileRes.error) throw new Error(profileRes.error.message);

    return {
      ...profileRes.data,
      preferences: prefsRes.data,
    };
  }
  
  /**
   * Creates a new user profile and optionally preferences.
   */
  export async function createUser(
    profileData: TablesInsert<"profiles">,
    preferencesData?: TablesInsert<"user_preferences">
  ) {
    const profileRes = await createProfile(profileData);
    if (profileRes.error) throw new Error(profileRes.error.message);
  
    if (preferencesData) {
      const prefsRes = await createUserPreferences(preferencesData);
      if (prefsRes.error) throw new Error(prefsRes.error.message);
    }
  
    return getFullUser(profileData.user_id);
  }
  
  /**
   * Updates profile and/or preferences in a single operation.
   */
  export async function updateUser(
    userId: string,
    profileUpdates?: TablesUpdate<"profiles">,
    preferenceUpdates?: TablesUpdate<"user_preferences">
  ) {
    if (profileUpdates) {
      const profileRes = await updateProfile(userId, profileUpdates);
      if (profileRes.error) throw new Error(profileRes.error.message);
    }
  
    if (preferenceUpdates) {
      const prefsRes = await updateUserPreferences(userId, preferenceUpdates);
      if (prefsRes.error) throw new Error(prefsRes.error.message);
    }
  
    return getFullUser(userId);
  }
  