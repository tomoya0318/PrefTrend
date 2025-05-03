import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { useGetPopulation } from "../useGetPopulation";

import { defaultConfig } from "@/api/fetcher";
import { server } from "@/mocks/server";

// 実際のAPIエンドポイントを構築
const API_BASE_URL = defaultConfig.baseURL;
const POPULATION_ENDPOINT = `${API_BASE_URL}/population/composition/perYear`;

// テスト用のQueryClientProviderラッパー
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPopulation", () => {
  // テスト実行前にサーバーを開始
  beforeAll(() => server.listen());

  // 各テスト後にモックをリセット
  afterEach(() => server.resetHandlers());

  // テスト終了後にサーバーを停止
  afterAll(() => server.close());

  describe("正常系", () => {
    it("空のprefCodesリストでは何もフェッチしない", async () => {
      const { result } = renderHook(() => useGetPopulation([]), {
        wrapper: createWrapper(),
      });

      expect(result.current.results).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    it("単一のprefCodeでデータを正常にフェッチする", async () => {
      const { result } = renderHook(() => useGetPopulation([1]), {
        wrapper: createWrapper(),
      });

      // 初期状態のローディング確認
      expect(result.current.isLoading).toBe(true);
      expect(result.current.results[0].isLoading).toBe(true);

      // データのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 結果の確認
      expect(result.current.results).toHaveLength(1);
      expect(result.current.results[0].prefCode).toBe(1);
      expect(result.current.results[0].error).toBeNull();
      expect(result.current.results[0].data).toBeDefined();
      expect(result.current.results[0].data?.boundaryYear).toBe(2020);
      expect(result.current.results[0].data?.data).toHaveLength(4); // 北海道は4つのラベルデータ
    });

    it("複数のprefCodeでデータを正常にフェッチする", async () => {
      const { result } = renderHook(() => useGetPopulation([1, 13]), {
        wrapper: createWrapper(),
      });

      // データのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 結果の確認
      expect(result.current.results).toHaveLength(2);

      // 北海道（prefCode: 1）の確認
      const hokkaidoResult = result.current.results.find((r) => r.prefCode === 1);
      expect(hokkaidoResult).toBeDefined();
      expect(hokkaidoResult?.data?.data).toHaveLength(4);
      expect(hokkaidoResult?.data?.data[0].label).toBe("総人口");
      expect(hokkaidoResult?.data?.data[1].label).toBe("年少人口");

      // 東京都（prefCode: 13）の確認
      const tokyoResult = result.current.results.find((r) => r.prefCode === 13);
      expect(tokyoResult).toBeDefined();
      expect(tokyoResult?.data?.data).toHaveLength(1); // 東京都は総人口のみ
      expect(tokyoResult?.data?.data[0].label).toBe("総人口");
    });
  });

  describe("異常系", () => {
    it("APIエラーが発生した場合、エラーがハンドリングされる", async () => {
      // APIエラーを発生させるモック
      server.use(
        http.get(POPULATION_ENDPOINT, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useGetPopulation([1]), {
        wrapper: createWrapper(),
      });

      // エラーの発生を待つ
      await waitFor(() => expect(result.current.hasError).toBe(true));

      // エラーの確認
      expect(result.current.results[0].error).not.toBeNull();
      expect(result.current.results[0].data).toBeUndefined();
    });

    it("複数のリクエストで部分的にエラーが発生する場合、個別にエラーハンドリングされる", async () => {
      // prefCode 13のみエラーを発生させる
      server.use(
        http.get(POPULATION_ENDPOINT, ({ request }) => {
          const url = new URL(request.url);
          const prefCode = url.searchParams.get("prefCode");

          if (prefCode === "13") {
            return new HttpResponse(null, { status: 500 });
          }

          // 通常のレスポンス（prefCode 1用）
          return HttpResponse.json({
            message: null,
            result: {
              boundaryYear: 2020,
              data: [{ label: "総人口", data: [] }],
            },
          });
        }),
      );

      const { result } = renderHook(() => useGetPopulation([1, 13]), {
        wrapper: createWrapper(),
      });

      // データとエラーの混在状態の完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 結果の確認
      expect(result.current.hasError).toBe(true);

      // 北海道（prefCode: 1）は成功
      const hokkaidoResult = result.current.results.find((r) => r.prefCode === 1);
      expect(hokkaidoResult?.error).toBeNull();
      expect(hokkaidoResult?.data).toBeDefined();

      // 東京都（prefCode: 13）はエラー
      const tokyoResult = result.current.results.find((r) => r.prefCode === 13);
      expect(tokyoResult?.error).not.toBeNull();
      expect(tokyoResult?.data).toBeUndefined();
    });
  });

  describe("機能テスト", () => {
    it("prefCodesが動的に変更された場合、正しくクエリが更新される", async () => {
      const { result, rerender } = renderHook((props) => useGetPopulation(props.prefCodes), {
        wrapper: createWrapper(),
        initialProps: { prefCodes: [1] },
      });

      // 初回フェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.results).toHaveLength(1);

      // prefCodesを更新
      rerender({ prefCodes: [1, 13] });

      // 新しいクエリが開始されることを確認
      expect(result.current.isLoading).toBe(true);

      // すべてのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 結果の確認
      expect(result.current.results).toHaveLength(2);
      expect(result.current.results.map((r) => r.prefCode)).toEqual([1, 13]);
    });
  });
});
