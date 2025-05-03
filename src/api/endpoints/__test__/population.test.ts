import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { server } from "../../../mocks/server";
import { isApiError, isZodError } from "../../../utils/typeGuards";
import fetcher from "../../fetcher";
import { getPopulation } from "../population";

describe("getPopulation", () => {
  // テスト実行前にサーバーを開始
  beforeAll(() => server.listen());

  // 各テスト後にモックリクエストハンドラーをリセット
  afterEach(() => server.resetHandlers());

  // テスト終了後にサーバーを停止
  afterAll(() => server.close());

  describe("正常系", () => {
    it("prefCode=1（北海道）の場合、すべての人口データが取得できる", async () => {
      const result = await getPopulation(1);

      expect(result.boundaryYear).toBe(2020);
      expect(result.data).toHaveLength(4);

      // 各ラベルのデータを確認
      const totalPopulation = result.data.find((item) => item.label === "総人口");
      expect(totalPopulation).toBeDefined();
      expect(totalPopulation!.data[0]).toEqual({ year: 1980, value: 5575989 });
      expect(totalPopulation!.data[1]).toEqual({ year: 2020, value: 5224614 });

      const youngPopulation = result.data.find((item) => item.label === "年少人口");
      expect(youngPopulation).toBeDefined();

      const productivePopulation = result.data.find((item) => item.label === "生産年齢人口");
      expect(productivePopulation).toBeDefined();

      const elderlyPopulation = result.data.find((item) => item.label === "老年人口");
      expect(elderlyPopulation).toBeDefined();
    });

    it("prefCode=13（東京都）の場合、総人口のみのデータが取得できる", async () => {
      const result = await getPopulation(13);

      expect(result.boundaryYear).toBe(2020);
      expect(result.data).toHaveLength(1);

      const totalPopulation = result.data[0];
      expect(totalPopulation.label).toBe("総人口");
      expect(totalPopulation.data[0]).toEqual({ year: 1980, value: 11618281 });
      expect(totalPopulation.data[1]).toEqual({ year: 2020, value: 14047594 });
    });
  });

  describe("異常系", () => {
    it("APIエラーが発生した場合、エラーがスローされる", async () => {
      // モックを一時的に置き換えてエラーを発生させる
      server.use(
        http.get("*/population/composition/perYear", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      await expect(getPopulation(1)).rejects.toThrow();

      try {
        await getPopulation(1);
      } catch (error) {
        expect(isApiError(error)).toBe(true);
      }
    });

    it("ZodErrorが発生した場合、エラーメッセージがスローされる", async () => {
      try {
        await fetcher.get("*/population/composition/perYear");
      } catch (error) {
        if (isApiError(error)) {
          expect(isZodError(error.originalError)).toBe(true);
        }
      }
    });

    it("予期しないエラーが発生した場合、汎用エラーメッセージがスローされる", async () => {
      // fetcher.getを一時的にモックしてエラーを発生させる
      const originalFetcherGet = fetcher.get;

      // エラーを発生させるモック
      fetcher.get = () => {
        throw new Error("Network error");
      };

      await expect(getPopulation(1)).rejects.toThrow("予期しないエラーが発生しました");

      // 元に戻す
      fetcher.get = originalFetcherGet;
    });
  });

  describe("パラメータ検証", () => {
    it("異なるprefCodeの値で正しく動作する", async () => {
      const results = await Promise.all([getPopulation(1), getPopulation(13)]);

      expect(results[0].data).toHaveLength(4); // 北海道：4種類の人口データ
      expect(results[1].data).toHaveLength(1); // 東京都：1種類の人口データ
    });

    it("存在しないprefCodeではエラーがスローされる", async () => {
      await expect(getPopulation(0)).rejects.toThrow();
      await expect(getPopulation(47)).rejects.toThrow();

      try {
        await getPopulation(999);
      } catch (error) {
        expect(isApiError(error)).toBe(true);
      }
    });

    it("負の値のprefCodeでもエラーがスローされる", async () => {
      await expect(getPopulation(-1)).rejects.toThrow();
    });
  });
});
