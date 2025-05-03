import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, test } from "vitest";

import { defaultConfig } from "../../api/fetcher";
import { server } from "../../mocks/server";
import { ApiError } from "../../types/errors";
import { isApiError } from "../../utils/typeGuards";
import { useGetPrefectures } from "../useGetPrefectures";

// 環境変数からベースURLを取得
const API_BASE_URL = defaultConfig.baseURL;
// 都道府県一覧のエンドポイントを構築
const PREFECTURES_ENDPOINT = `${API_BASE_URL}/prefectures`;

// テスト用のQueryClientラッパー
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // テスト中の再試行を無効化
        gcTime: 0, // キャッシュによるテスト間の干渉を防止
      },
    },
  });
};

// テスト用ラッパー
const createWrapper = () => {
  const testClient = createTestQueryClient();

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={testClient}>{children}</QueryClientProvider>
  );
};

describe("useGetPrefectures", () => {
  // 各テストの前にMSWハンドラーをリセット
  beforeEach(() => {
    server.resetHandlers();
  });

  test("都道府県データを正常に取得する", async () => {
    // API設定から構築したエンドポイントを使用
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

    // テスト用のラッパーを作成
    const wrapper = createWrapper();

    // フックをレンダリング
    const { result } = renderHook(() => useGetPrefectures(), { wrapper });

    // 初期状態では読み込み中
    expect(result.current.isLoading).toBe(true);
    expect(result.current.prefectures).toBeUndefined();

    // データ取得完了を待機
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // 正しいデータが取得できたことを確認
    expect(result.current.prefectures).toEqual([
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 13, prefName: "東京都" },
    ]);
    expect(result.current.error).toBeNull();
  });

  test("エラー発生時の処理", async () => {
    // エラーレスポンスのモック
    server.use(
      http.get(PREFECTURES_ENDPOINT, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Internal Server Error",
        });
      }),
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetPrefectures(), { wrapper });

    // エラー状態になるまで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // エラー状態の確認
    expect(result.current.error).toBeTruthy();
    // エラーがApiError型であることを確認
    expect(isApiError(result.current.error)).toBe(true);
    // ApiError型として扱えることを確認
    const apiError = result.current.error as ApiError;
    expect(apiError.status).toBe(500);
    expect(result.current.prefectures).toBeUndefined();
  });

  test("ネットワークエラーの場合", async () => {
    // ネットワークエラーのモック
    server.use(
      http.get(PREFECTURES_ENDPOINT, () => {
        return HttpResponse.error();
      }),
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetPrefectures(), { wrapper });

    // エラー状態になるまで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // エラー状態の確認
    expect(result.current.error).toBeTruthy();
    expect(result.current.prefectures).toBeUndefined();
    expect(result.current.error?.message).toBeTruthy();
  });

  test("キャッシュからデータを取得する場合", async () => {
    // キャッシュテスト用のレスポンス
    server.use(
      http.get(PREFECTURES_ENDPOINT, () => {
        return HttpResponse.json({
          message: "正常に取得しました",
          result: [
            { prefCode: 1, prefName: "北海道" },
            { prefCode: 2, prefName: "青森県" },
          ],
        });
      }),
    );

    // 共有のQueryClientを使用するための特別なラッパー
    const queryClient = createTestQueryClient();
    const sharedWrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // 1回目のレンダリング
    const { result: firstResult, unmount: firstUnmount } = renderHook(() => useGetPrefectures(), {
      wrapper: sharedWrapper,
    });

    // データ取得完了を待機
    await waitFor(() => expect(firstResult.current.isLoading).toBe(false));

    firstUnmount();

    // 2回目のレンダリング（キャッシュからデータを取得）
    const { result: secondResult } = renderHook(() => useGetPrefectures(), {
      wrapper: sharedWrapper,
    });

    // 2回目はキャッシュから取得するため、isLoadingがfalseであり、
    // データが既に利用可能
    expect(secondResult.current.isLoading).toBe(false);
    expect(secondResult.current.prefectures).toEqual([
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 2, prefName: "青森県" },
    ]);
  });
});
