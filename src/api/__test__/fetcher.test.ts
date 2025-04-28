import { AxiosError } from "axios";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { server } from "../../mocks/server";
import { createFetcher, defaultConfig, handleApiError } from "../fetcher";

describe("fetcher module", () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    // 各テストのモックハンドラーをリセット
    server.resetHandlers();
  });

  describe("createFetcher", () => {
    it("デフォルト設定でAxiosインスタンスを作成する", () => {
      const fetcher = createFetcher();
      expect(fetcher.defaults.baseURL).toBe(defaultConfig.baseURL);

      // Axiosで設定されるヘッダーは階層が異なる場合がある
      // ヘッダーが存在するかどうか、そのままの形で確認
      const headers = fetcher.defaults.headers;
      expect(headers["X-API-KEY"] || headers.common["X-API-KEY"]).toBe(defaultConfig.apiKey);
      expect(headers["Content-Type"] || headers.common["Content-Type"]).toBe("application/json");
    });

    it("カスタム設定でAxiosインスタンスを作成する", () => {
      // カスタム設定
      const customConfig = {
        baseURL: "https://custom-api.example.com",
        apiKey: "custom-api-key",
      };

      const fetcher = createFetcher(customConfig);
      expect(fetcher.defaults.baseURL).toBe(customConfig.baseURL);

      // ヘッダー確認の修正
      const headers = fetcher.defaults.headers;
      expect(headers["X-API-KEY"] || headers.common["X-API-KEY"]).toBe(customConfig.apiKey);
      expect(headers["Content-Type"] || headers.common["Content-Type"]).toBe("application/json");
    });
  });

  describe("handleApiError", () => {
    it("400エラーを正しく処理する", () => {
      // 400エラーのモック作成
      const mockError = {
        response: { status: 400 },
        isAxiosError: true,
      } as unknown as AxiosError;

      // 関数実行
      const result = handleApiError(mockError);

      // 結果の検証
      expect(result).toEqual({
        status: 400,
        message:
          "必要なパラメータが正しく設定されていません。必須パラメータや形式を確認してください。",
        originalError: mockError,
      });
    });

    it("403エラーを正しく処理する", () => {
      // 403エラーのモック作成
      const mockError = {
        response: { status: 403 },
        isAxiosError: true,
      } as unknown as AxiosError;

      // 関数実行
      const result = handleApiError(mockError);

      // 結果の検証
      expect(result).toEqual({
        status: 403,
        message: "APIキーが存在しないか無効です。APIキーの設定を確認してください。",
        originalError: mockError,
      });
    });

    it("不明なエラーを正しく処理する", () => {
      // 未定義ステータスのエラーモック作成
      const mockError = {
        response: { status: 999 },
        isAxiosError: true,
      } as unknown as AxiosError;

      // 関数実行
      const result = handleApiError(mockError);

      // 結果の検証
      expect(result).toEqual({
        status: 999,
        message: "予期しないエラーが発生しました。",
        originalError: mockError,
      });
    });
  });

  // インターセプターのテスト - MSWを使用したバージョン
  describe("interceptors", () => {
    it("リクエスト成功時に正しくレスポンスを返却する", async () => {
      // モックレスポンスをMSWで設定
      server.use(
        http.get("https://test-api.example.com/test", () => {
          return HttpResponse.json({ success: true, data: "test-data" });
        }),
      );

      // テスト用のfetcherを作成
      const testFetcher = createFetcher({
        baseURL: "https://test-api.example.com",
        apiKey: "test-api-key",
      });

      // APIリクエストを実行
      const response = await testFetcher.get("/test");

      // レスポンスを検証
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ success: true, data: "test-data" });
    });

    it("エラーレスポンスを適切に処理する", async () => {
      // 403エラーをMSWで設定
      server.use(
        http.get("https://test-api.example.com/error", () => {
          return new HttpResponse(null, { status: 403 });
        }),
      );

      // テスト用のfetcherを作成
      const testFetcher = createFetcher({
        baseURL: "https://test-api.example.com",
        apiKey: "test-api-key",
      });

      // エラーをキャッチして検証
      try {
        await testFetcher.get("/error");
        // エラーが発生しなかった場合はテスト失敗
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.status).toBe(403);
        expect(error.message).toBe(
          "APIキーが存在しないか無効です。APIキーの設定を確認してください。",
        );
      }
    });
  });
});
