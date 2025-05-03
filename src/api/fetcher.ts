import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { ApiError } from "../types/errors";
import { isZodError } from "../utils/typeGuards";

// デフォルト値を設定（環境変数から、またはテスト時に差し替え可能）
export const defaultConfig = {
  baseURL: import.meta.env.VITE_API_URL || "",
  apiKey: import.meta.env.VITE_API_KEY || "",
};

// エラーハンドリングロジックを分離
export const handleApiError = (error: AxiosError): ApiError => {
  const apiError: ApiError = {
    status: error.response?.status,
    message: "",
    originalError: error,
  };

  // ステータスコードに応じたエラーメッセージの設定
  switch (apiError.status) {
    case 400:
      // レスポンスデータがZodErrorの場合
      if (error.response?.data && isZodError(error.response.data)) {
        apiError.message = "リクエストの形式が正しくありません。";
        // ZodErrorデータもoriginalErrorとして保持
        apiError.originalError = error.response.data;
      } else {
        apiError.message =
          "必要なパラメータが正しく設定されていません。必須パラメータや形式を確認してください。";
      }
      break;
    case 403:
      apiError.message = "APIキーが存在しないか無効です。APIキーの設定を確認してください。";
      break;
    case 404:
      apiError.message =
        "指定されたURLに対応するAPIが存在しません。APIのアドレスを確認してください。";
      break;
    case 500:
      apiError.message = "APIサーバーに問題が発生しました。時間をおいて再度お試しください。";
      break;
    default:
      apiError.message = "予期しないエラーが発生しました。";
      break;
  }

  return apiError;
};

// Axiosインスタンスを作成する関数（テスト時にモックしやすい）
export const createFetcher = (config = defaultConfig): AxiosInstance => {
  console.log("API URL:", config.baseURL);
  console.log("API KEY:", config.apiKey);
  const instance = axios.create({
    baseURL: config.baseURL,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": config.apiKey,
    },
  });

  // レスポンスインターセプターを追加
  instance.interceptors.response.use(
    // 成功時はそのままレスポンスを返す
    (response: AxiosResponse) => response,
    // エラー発生時の処理
    (error: AxiosError) => {
      const apiError = handleApiError(error);
      // カスタマイズしたエラーを返してPromiseをrejectする
      return Promise.reject(apiError);
    },
  );

  return instance;
};

// デフォルトのFetcherインスタンスをエクスポート
export const fetcher = createFetcher();

export default fetcher;
