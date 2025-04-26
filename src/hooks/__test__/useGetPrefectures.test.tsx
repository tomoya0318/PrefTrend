import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { getPrefectures } from "../../api/endpoints/prefecture";
import { useGetPrefectures } from "../useGetPrefectures"; // パスは適宜調整してください

// API呼び出しをモック
jest.mock("../../api/endpoints/prefecture", () => ({
  getPrefectures: jest.fn(),
}));

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
  // 各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("都道府県データを正常に取得する", async () => {
    // モックの戻り値を設定
    const mockPrefectures = [
      { id: 1, name: "北海道" },
      { id: 2, name: "青森県" },
      { id: 3, name: "岩手県" },
      // 必要に応じて追加
    ];

    (getPrefectures as jest.Mock).mockResolvedValueOnce(mockPrefectures);

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
    expect(result.current.prefectures).toEqual(mockPrefectures);
    expect(result.current.error).toBeNull();

    // APIが正しく呼び出されたことを確認
    expect(getPrefectures).toHaveBeenCalledTimes(1);
  });

  test("エラー発生時の処理", async () => {
    // エラーをモック
    const mockError = new Error("データの取得に失敗しました");
    (getPrefectures as jest.Mock).mockRejectedValueOnce(mockError);

    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetPrefectures(), { wrapper });

    // エラー状態になるまで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // エラー状態の確認
    expect(result.current.error).toBeTruthy();
    expect(result.current.prefectures).toBeUndefined();

    // APIが呼び出されたことを確認
    expect(getPrefectures).toHaveBeenCalledTimes(1);
  });

  test("キャッシュからデータを取得する場合", async () => {
    // 1回目のAPI呼び出し用のモック
    const mockPrefectures = [
      { id: 1, name: "北海道" },
      { id: 2, name: "青森県" },
    ];
    (getPrefectures as jest.Mock).mockResolvedValueOnce(mockPrefectures);

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
    expect(getPrefectures).toHaveBeenCalledTimes(1);

    firstUnmount();

    // 2回目のレンダリング（キャッシュからデータを取得）
    const { result: secondResult } = renderHook(() => useGetPrefectures(), {
      wrapper: sharedWrapper,
    });

    // 2回目はキャッシュから取得するため、isLoadingがfalseであり、
    // データが既に利用可能
    expect(secondResult.current.isLoading).toBe(false);
    expect(secondResult.current.prefectures).toEqual(mockPrefectures);

    // APIは2回目は呼び出されない（キャッシュから取得）
    expect(getPrefectures).toHaveBeenCalledTimes(1);
  });
});
