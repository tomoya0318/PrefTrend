import axios from "axios";
import { AxiosError } from "axios";

import { createFetcher, defaultConfig, handleApiError } from "../fetcher";

// Axiosのモック設定
jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    })),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetcher module", () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createFetcher", () => {
    it("デフォルト設定でAxiosインスタンスを作成する", () => {
      // 関数実行
      createFetcher();

      // Axiosのcreate関数が正しく呼ばれたか検証
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: defaultConfig.baseURL,
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": defaultConfig.apiKey,
        },
      });
    });

    it("カスタム設定でAxiosインスタンスを作成する", () => {
      // カスタム設定
      const customConfig = {
        baseURL: "https://custom-api.example.com",
        apiKey: "custom-api-key",
      };

      // 関数実行
      createFetcher(customConfig);

      // Axiosのcreate関数が正しく呼ばれたか検証
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: customConfig.baseURL,
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": customConfig.apiKey,
        },
      });
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

  // インターセプターのテスト
  describe("interceptors", () => {
    it("レスポンスインターセプターが正しく設定される", () => {
      // axiosインスタンスの戻り値をモック
      const mockUse = jest.fn();
      const mockedInstance = {
        interceptors: {
          response: {
            use: mockUse,
          },
        },
      };

      // createのモックを一時的に上書き
      mockedAxios.create.mockReturnValueOnce(mockedInstance as any);

      // fetcherを作成
      createFetcher();

      // インターセプターが正しく設定されたか検証
      expect(mockUse).toHaveBeenCalled();
      expect(mockUse.mock.calls[0].length).toBe(2); // 成功と失敗のハンドラーが渡されたか確認
    });
  });
});
