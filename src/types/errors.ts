import { AxiosError } from "axios";

// エラーレスポンスの型定義
export interface ApiError {
  status: number | undefined;
  message: string;
  originalError: AxiosError | ZodError | Error;
}

export interface ZodError {
  success: false;
  error: {
    issues: Array<{
      code: string;
      expected: string;
      received: string;
      path: string[];
      message: string;
    }>;
    name: "ZodError";
  };
}
