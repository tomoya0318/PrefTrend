import { ApiResponse } from "../../types/api";
import { PopulationCompositionPerYear } from "../../types/domain/population";
import { isApiError } from "../../utils/typeGuards";
import { fetcher } from "../fetcher";

// 都道府県の人口データを取得するAPI
export const getPopulation = async (prefCode: number): Promise<PopulationCompositionPerYear> => {
  try {
    const response = await fetcher.get<ApiResponse<PopulationCompositionPerYear>>(
      `/population/composition/perYear?prefCode=${prefCode}`,
    );
    return response.data.result;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    // 未知のエラーの場合は汎用エラーとして再スロー
    throw new Error("予期しないエラーが発生しました");
  }
};
