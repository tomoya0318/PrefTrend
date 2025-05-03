import { ApiResponse } from "@/types/api";
import { Prefecture } from "@/types/domain/prefecture";

import { isApiError } from "@/utils/typeGuards";

import { fetcher } from "@/api/fetcher";

// 都道府県一覧を取得するAPI
export const getPrefectures = async (): Promise<Prefecture[]> => {
  try {
    const response = await fetcher.get<ApiResponse<Prefecture[]>>("/prefectures");
    return response.data.result;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    // 未知のエラーの場合は汎用エラーとして再スロー
    throw new Error("予期しないエラーが発生しました");
  }
};
