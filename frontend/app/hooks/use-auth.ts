import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { apiClient, ApiError } from "~/lib/api-client";

export interface User {
  id: string;
  email: string;
  name?: string | null;
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
    mutationFn: () => apiClient<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/login", { replace: true });
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
    refetchUser: () => userQuery.refetch(),
  };
}
