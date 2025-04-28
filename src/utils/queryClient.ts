import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // 1回のリトライを許可
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 15, // 15分
    },
  },
});
