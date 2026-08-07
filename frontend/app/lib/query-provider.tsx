import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ApiError } from "./api-client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const handleUnauthorized = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
  };

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: handleUnauthorized,
    }),
    mutationCache: new MutationCache({
      onError: handleUnauthorized,
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.status === 401) {
            return false;
          }
          return failureCount < 1;
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
