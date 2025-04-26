import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// デフォルト値を設定（環境変数から、またはテスト時に差し替え可能）
export const defaultConfig = {
  baseURL: process.env.VITE_API_URL || "",
  apiKey: process.env.VITE_API_KEY || "",
};

// エラーレスポンスの型定義
export interface CustomError {
  status: number | undefined;
  message: string;
  originalError: AxiosError | Error;
}

// エラーハンドリングロジックを分離
export const handleApiError = (error: AxiosError): CustomError => {
  const customError: CustomError = {
    status: error.response?.status,
    message: "",
    originalError: error,
  };

  // ステータスコードに応じたエラーメッセージの設定
  switch (customError.status) {
    case 400:
      customError.message =
        "必要なパラメータが正しく設定されていません。必須パラメータや形式を確認してください。";
      break;
    case 403:
      customError.message = "APIキーが存在しないか無効です。APIキーの設定を確認してください。";
      break;
    case 404:
      customError.message =
        "指定されたURLに対応するAPIが存在しません。APIのアドレスを確認してください。";
      break;
    case 500:
      customError.message = "APIサーバーに問題が発生しました。時間をおいて再度お試しください。";
      break;
    default:
      customError.message = "予期しないエラーが発生しました。";
      break;
  }

  return customError;
};

// Axiosインスタンスを作成する関数（テスト時にモックしやすい）
export const createFetcher = (config = defaultConfig): AxiosInstance => {
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
      const customError = handleApiError(error);
      // カスタマイズしたエラーを返してPromiseをrejectする
      return Promise.reject(customError);
    },
  );

  return instance;
};

// デフォルトのFetcherインスタンスをエクスポート
export const fetcher = createFetcher();

export default fetcher;
