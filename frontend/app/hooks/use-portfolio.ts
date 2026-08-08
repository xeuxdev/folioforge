import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "~/lib/api-client";
import type {
  PortfolioPreferences,
  PublicPortfolioPayload,
  UpdatePortfolioPreferencesPayload,
} from "~/types/portfolio";

/** Fetch and mutate the authenticated user's portfolio preferences. */
export function usePortfolioPreferences() {
  const queryClient = useQueryClient();

  const preferencesQuery = useQuery<PortfolioPreferences, ApiError>({
    queryKey: ["portfolio", "preferences"],
    queryFn: () =>
      apiClient<PortfolioPreferences>("/api/v1/portfolio/preferences"),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation<
    PortfolioPreferences,
    ApiError,
    UpdatePortfolioPreferencesPayload
  >({
    mutationFn: (payload) =>
      apiClient<PortfolioPreferences>("/api/v1/portfolio/preferences", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["portfolio", "preferences"], updated);
    },
  });

  return {
    preferences: preferencesQuery.data ?? null,
    isLoading: preferencesQuery.isLoading,
    isError: preferencesQuery.isError,
    error: preferencesQuery.error,
    updatePreferences: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}

/** Fetch the public portfolio payload for a given username slug. */
export function usePublicPortfolio(username: string | undefined) {
  return useQuery<PublicPortfolioPayload, ApiError>({
    queryKey: ["portfolio", "public", username],
    queryFn: () =>
      apiClient<PublicPortfolioPayload>(`/api/v1/portfolio/u/${username}`),
    enabled: Boolean(username),
    staleTime: 1000 * 60 * 2,
  });
}
