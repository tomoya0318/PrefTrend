import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // 1回のリトライを許可
      staleTime: Infinity, // 人口データは頻繁に変更されないため
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7日間
    },
  },
});
