import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { apiClient, ApiError } from "~/lib/api-client";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const userQuery = useQuery<User, ApiError>({
    queryKey: ["auth", "me"],
    queryFn: () => apiClient<User>("/api/v1/auth/me"),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: () =>
      apiClient<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/login", { replace: true });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; username?: string; avatarUrl?: string | null }) =>
      apiClient<User>("/api/v1/auth/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "me"], updatedUser);
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      // Raw fetch for multipart form-data to preserve headers
      const res = await fetch("/api/v1/auth/photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to upload profile photo");
      }

      return (await res.json()) as User;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "me"], updatedUser);
    },
  });

  const loginWithGoogle = () => {
    window.location.href = "/api/v1/auth/google";
  };

  return {
    user: userQuery.data ?? null,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    error: userQuery.error,
    isAuthenticated: Boolean(userQuery.data),
    loginWithGoogle,
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    uploadPhoto: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,
    refetchUser: () => userQuery.refetch(),
  };
}
