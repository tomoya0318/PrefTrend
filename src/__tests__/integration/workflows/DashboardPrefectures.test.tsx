import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultConfig } from "../../../api/fetcher";
import { DashboardTemplate } from "../../../components/templates/DashboardTemplate";
import { useGetPrefectures } from "../../../hooks/useGetPrefectures";
import { server } from "../../../mocks/server";

// テスト用のラッパーコンポーネント
function TestComponent() {
  const [checkedPrefCodes, setCheckedPrefCodes] = useState<number[]>([]);
  const { prefectures, isLoading, error } = useGetPrefectures();

  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    if (checked) {
      setCheckedPrefCodes((prev) => [...prev, prefCode]);
    } else {
      setCheckedPrefCodes((prev) => prev.filter((code) => code !== prefCode));
    }
  };

  if (isLoading) return <div>ローディング中...</div>;
  if (error) return <div>エラーが発生しました</div>;
  if (!prefectures) return <div>データがありません</div>;

  return (
    <DashboardTemplate
      checkedPrefCodes={checkedPrefCodes}
      prefectures={prefectures}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}

describe("DashboardTemplate と useGetPrefectures の統合テスト", () => {
  // 各テストの前後でMSWハンドラーをリセット
  beforeEach(() => {
    server.resetHandlers();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  // 各テストで新しいQueryClientを作成
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // キャッシュによるテスト間の干渉を防止
        },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("都道府県データを取得して表示する", async () => {
    // 正常なレスポンスをモック
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.json({
          message: "正常に取得しました",
          result: [
            { prefCode: 1, prefName: "北海道" },
            { prefCode: 13, prefName: "東京都" },
          ],
        });
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper: wrapper });

    // ローディング表示を確認
    expect(screen.getByText("ローディング中...")).toBeInTheDocument();

    // データが取得され表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("北海道")).toBeInTheDocument();
    });
    expect(screen.getByText("東京都")).toBeInTheDocument();

    // チェックボックスが2つあることを確認
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });

  it("複数の都道府県を選択できる", async () => {
    const user = userEvent.setup();

    // 正常なレスポンスをモック
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.json({
          message: "正常に取得しました",
          result: [
            { prefCode: 1, prefName: "北海道" },
            { prefCode: 13, prefName: "東京都" },
          ],
        });
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper: wrapper });

    // データが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("北海道")).toBeInTheDocument();
      expect(screen.getByText("東京都")).toBeInTheDocument();
    });

    // 北海道と東京都のチェックボックスを特定
    const hokkaidoCheckbox = screen.getByLabelText("北海道を選択");
    const tokyoCheckbox = screen.getByLabelText("東京都を選択");

    // 両方チェック
    await user.click(hokkaidoCheckbox);
    await user.click(tokyoCheckbox);

    // 両方チェックされていることを確認
    expect(hokkaidoCheckbox).toBeChecked();
    expect(tokyoCheckbox).toBeChecked();

    // 北海道のみチェックを外す
    await user.click(hokkaidoCheckbox);

    // 北海道のチェックが外れ、東京都はチェックされたままであることを確認
    expect(hokkaidoCheckbox).not.toBeChecked();
    expect(tokyoCheckbox).toBeChecked();
  });

  it("APIエラー時にエラーメッセージを表示する", async () => {
    // 一時的にエラーを返すハンドラーでモックを上書き
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.error();
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper: wrapper });

    // ローディング表示を確認
    expect(screen.getByText("ローディング中...")).toBeInTheDocument();

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    });
  });
});
