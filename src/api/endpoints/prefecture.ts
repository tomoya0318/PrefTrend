import { Prefecture } from "../../types/domain/prefecture";
import { fetcher } from "../fetcher";

interface PrefectureResponse {
  message: string;
  result: Prefecture[];
}

// 都道府県一覧を取得するAPI
export const getPrefectures = async (): Promise<Prefecture[]> => {
  const response = await fetcher.get<PrefectureResponse>("/prefectures");
  return response.data.result;
};
