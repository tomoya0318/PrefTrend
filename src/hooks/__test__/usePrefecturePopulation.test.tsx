import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { defaultConfig } from "../../api/fetcher";
import { server } from "../../mocks/server";
import { Prefecture } from "../../types/domain/prefecture";
import { usePrefecturePopulation } from "../usePrefecturePopulation";

// 実際のAPIエンドポイントを構築
const API_BASE_URL = defaultConfig.baseURL;
const POPULATION_ENDPOINT = `${API_BASE_URL}/population/composition/perYear`;

// テスト用の都道府県データ
const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 13, prefName: "東京都" },
  { prefCode: 27, prefName: "大阪府" },
];

// テスト用のQueryClientProviderとRouterのラッパー
const createWrapper = (initialPath: string = "/") => {
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
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route element={<>{children}</>} path="*" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("usePrefecturePopulation", () => {
  // テスト実行前にサーバーを開始
  beforeAll(() => server.listen());

  // 各テスト後にモックをリセット
  afterEach(() => server.resetHandlers());

  // テスト終了後にサーバーを停止
  afterAll(() => server.close());

  describe("初期状態", () => {
    it("初期状態では選択された都道府県がない", async () => {
      const { result } = renderHook(() => usePrefecturePopulation(mockPrefectures, "総人口"), {
        wrapper: createWrapper(),
      });

      expect(result.current.checkedPrefCodes).toEqual([]);
      expect(result.current.populationData).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.hasError).toBe(false);
    });

    it("URLからprefCodeパラメータを正しく読み取る", async () => {
      const { result } = renderHook(() => usePrefecturePopulation(mockPrefectures, "総人口"), {
        wrapper: createWrapper("/?prefCode=1,13"),
      });

      expect(result.current.checkedPrefCodes).toEqual([1, 13]);

      // 初期状態ではローディング中
      expect(result.current.isLoading).toBe(true);

      // データのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 結果の確認
      expect(result.current.hasError).toBe(false);
      expect(result.current.populationData).not.toEqual([]);
      expect(result.current.populationData.length).toBeGreaterThan(0);

      // 各年のデータには北海道と東京都の人口データが含まれている
      const firstYearData = result.current.populationData[0];
      expect(firstYearData).toHaveProperty("北海道");
      expect(firstYearData).toHaveProperty("東京都");
      expect(firstYearData).not.toHaveProperty("大阪府");
    });
  });

  describe("都道府県の選択と人口データの取得", () => {
    it("選択した都道府県の人口データを正しく取得する", async () => {
      const { result } = renderHook(() => usePrefecturePopulation(mockPrefectures, "総人口"), {
        wrapper: createWrapper("/?prefCode=1"),
      });

      // 北海道のみ選択されていることを確認
      expect(result.current.checkedPrefCodes).toEqual([1]);

      // データのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 北海道の人口データが含まれていることを確認
      const someYearData = result.current.populationData[0];
      expect(someYearData).toHaveProperty("北海道");
      expect(someYearData).not.toHaveProperty("東京都");
    });
  });

  describe("異なるラベルでの人口データ取得", () => {
    it("年少人口ラベルでデータを取得できる", async () => {
      const { result } = renderHook(() => usePrefecturePopulation(mockPrefectures, "年少人口"), {
        wrapper: createWrapper("/?prefCode=1"),
      });

      // データのフェッチ完了を待つ
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // 年少人口データが含まれていることを確認
      expect(result.current.populationData.length).toBeGreaterThan(0);
    });
  });

  describe("エラーハンドリング", () => {
    it("APIエラーが発生した場合、エラーがハンドリングされる", async () => {
      // APIエラーを発生させるモック
      server.use(
        http.get(POPULATION_ENDPOINT, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );

      const { result } = renderHook(() => usePrefecturePopulation(mockPrefectures, "総人口"), {
        wrapper: createWrapper("/?prefCode=1"),
      });

      // エラーの発生を待つ
      await waitFor(() => expect(result.current.hasError).toBe(true));

      // エラー時も選択状態は維持されている
      expect(result.current.checkedPrefCodes).toEqual([1]);
      // エラー時はpopulationDataは空配列
      expect(result.current.populationData).toEqual([]);
    });
  });
});
