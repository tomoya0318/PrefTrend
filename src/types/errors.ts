import { AxiosError } from "axios";

// エラーレスポンスの型定義
export interface ApiError {
  status: number | undefined;
  message: string;
  originalError: AxiosError | Error;
}
