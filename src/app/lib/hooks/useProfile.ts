import { useState, useEffect } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  level: "beginner" | "intermediate" | "advanced";
  timezone: string;
  avatarUrl: string;
  minutesPerDay: number;
  createdAt: string;
  updatedAt: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const response = await fetch("/api/profiles");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch profile");
      }

      const profileData = await response.json();
      setProfile(profileData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setIsError(true);
      setError(err instanceof Error ? err.message : "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    try {
      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refetch profile to get updated data
      await fetchProfile();
      return true;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      return false;
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/profiles/avatar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload avatar");
      }

      const result = await response.json();
      
      // Update local profile state with new avatar URL
      setProfile(prev => prev ? { ...prev, avatarUrl: result.avatarUrl } : null);
      
      return true;
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setError(err instanceof Error ? err.message : "Failed to upload avatar");
      return false;
    }
  };

  const removeAvatar = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/profiles/avatar", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove avatar");
      }

      // Update local profile state to remove avatar URL
      setProfile(prev => prev ? { ...prev, avatarUrl: "" } : null);
      
      return true;
    } catch (err) {
      console.error("Error removing avatar:", err);
      setError(err instanceof Error ? err.message : "Failed to remove avatar");
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    isError,
    error,
    updateProfile,
    uploadAvatar,
    removeAvatar,
    refetch: fetchProfile,
  };
}
