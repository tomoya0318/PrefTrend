import { useQuery } from "@tanstack/react-query";

import { getPrefectures } from "../api/endpoints/prefecture";

export function useGetPrefectures() {
  const {
    data: prefectures,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prefectures"],
    queryFn: getPrefectures,
    staleTime: Infinity, // 無期限に鮮度を保つ
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7日間
  });
  return {
    prefectures,
    isLoading,
    error,
  };
}
