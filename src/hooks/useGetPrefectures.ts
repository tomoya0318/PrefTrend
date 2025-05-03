import { useQuery } from "@tanstack/react-query";

import { getPrefectures } from "../api/endpoints/prefecture";
import { Prefecture } from "../types/domain/prefecture";
import { ApiError } from "../types/errors";

export function useGetPrefectures() {
  const {
    data: prefectures,
    isLoading,
    error,
    refetch,
  } = useQuery<Prefecture[], ApiError>({
    queryKey: ["prefectures"],
    queryFn: getPrefectures,
  });

  return {
    prefectures,
    isLoading,
    error,
    refetch,
  };
}
