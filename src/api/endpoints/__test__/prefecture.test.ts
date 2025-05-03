import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";

import { getPrefectures } from "../prefecture";

import { defaultConfig } from "@/api/fetcher";
import { server } from "@/mocks/server";

// 環境設定からAPIエンドポイントを構築
const API_BASE_URL = defaultConfig.baseURL;
const PREFECTURES_ENDPOINT = `${API_BASE_URL}/prefectures`;

describe("Prefecture API", () => {
  // 各テスト前にハンドラーをリセット
  beforeEach(() => {
    server.resetHandlers();
  });

  describe("getPrefectures", () => {
    it("都道府県一覧を正常に取得できること", async () => {
      // 環境設定から構築したエンドポイントを使用
      server.use(
        http.get(PREFECTURES_ENDPOINT, () => {
          return HttpResponse.json({
            message: "正常に取得しました",
            result: [
              { prefCode: 1, prefName: "北海道" },
              { prefCode: 13, prefName: "東京都" },
            ],
          });
        }),
      );

      // API呼び出し
      const result = await getPrefectures();

      // 検証
      expect(result).toEqual([
        { prefCode: 1, prefName: "北海道" },
        { prefCode: 13, prefName: "東京都" },
      ]);
      expect(result.length).toBe(2);
    });

    it("API呼び出しが失敗した場合にエラーがスローされること", async () => {
      // エラーレスポンスを設定
      server.use(
        http.get(PREFECTURES_ENDPOINT, () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: "Internal Server Error",
          });
        }),
      );

      // APIを呼び出し、エラーがスローされることを確認
      await expect(getPrefectures()).rejects.toThrow();
    });

    it("ネットワークエラーの場合に汎用エラーメッセージがスローされること", async () => {
      // ネットワークエラーをシミュレート
      server.use(
        http.get(PREFECTURES_ENDPOINT, () => {
          return HttpResponse.error();
        }),
      );

      // APIを呼び出し、特定のエラーメッセージがスローされることを確認
      await expect(getPrefectures()).rejects.toThrow("予期しないエラーが発生しました");
    });
  });
});
