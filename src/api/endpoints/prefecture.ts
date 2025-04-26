import { Prefecture } from "../../types/api/prefecture";
import { fetcher } from "../fetcher";

// 都道府県一覧を取得するAPI
export const getPrefectures = async (): Promise<Prefecture[]> => {
  const response = await fetcher.get<Prefecture[]>("/prefectures");
  return response.data;
};
