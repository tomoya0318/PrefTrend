import { useQueries, UseQueryResult } from "@tanstack/react-query";

import { getPopulation } from "../api/endpoints/population";
import { PopulationCompositionPerYear } from "../types/domain/population";
import { ApiError } from "../types/errors";

export interface ResultWithPrefCode {
  prefCode: number;
  data?: PopulationCompositionPerYear;
  isLoading: boolean;
  error: ApiError | null;
}

export function useGetPopulation(prefCodes: number[]) {
  const queries: UseQueryResult<PopulationCompositionPerYear, ApiError>[] = useQueries({
    queries: prefCodes.map((prefCode) => ({
      queryKey: ["population", prefCode],
      queryFn: () => getPopulation(prefCode),
      enabled: prefCodes.length > 0,
    })),
  });

  // prefCodeとインデックスで対応を管理
  const results: ResultWithPrefCode[] = queries.map((query, index) => ({
    prefCode: prefCodes[index],
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }));

  return {
    results,
    isLoading: queries.some((q) => q.isLoading),
    hasError: queries.some((q) => q.error),
  };
}
