import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultConfig } from "../../../api/fetcher";
import { ErrorMessage } from "../../../components/molecules/ErrorMessage";
import { Loading } from "../../../components/molecules/Loading";
import { PrefectureCheckbox } from "../../../components/molecules/PrefectureCheckbox";
import { useGetPrefectures } from "../../../hooks/useGetPrefectures";
import { server } from "../../../mocks/server";
import { isApiError } from "../../../utils/typeGuards";

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        {isApiError(error) ? (
          <ErrorMessage error={error} onClick={() => window.location.reload()} />
        ) : (
          <ErrorMessage
            message="予期せぬエラーが発生しました"
            onClick={() => window.location.reload()}
          />
        )}
      </div>
    );
  }

  if (!prefectures || prefectures.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage
          message="都道府県データが見つかりませんでした"
          title="データが見つかりません"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4" data-testid="prefecture-list">
      <h2 className="text-xl font-bold">都道府県選択</h2>
      <div className="flex flex-wrap gap-2">
        {prefectures.map((prefecture) => (
          <PrefectureCheckbox
            key={prefecture.prefCode}
            checked={checkedPrefCodes.includes(prefecture.prefCode)}
            prefecture={prefecture}
            onChange={(prefCode: number, checked: boolean) =>
              handlePrefectureChange(prefCode, checked)
            }
          />
        ))}
      </div>
      <div data-testid="selected-prefectures">
        選択中:{" "}
        {checkedPrefCodes
          .map((code) => {
            const pref = prefectures.find((p) => p.prefCode === code);
            return pref ? pref.prefName : "";
          })
          .join(", ")}
      </div>
    </div>
  );
}

describe("useGetPrefectures と PrefectureCheckbox の統合テスト", () => {
  // 各テストの前後でMSWハンドラーをリセット
  beforeEach(() => {
    server.resetHandlers();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  // テスト用のQueryClientProviderラッパー
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

  it("都道府県データを取得してPrefectureCheckboxとして表示する", async () => {
    // 正常なレスポンスをモック
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.json({
          message: "正常に取得しました",
          result: [
            { prefCode: 1, prefName: "北海道" },
            { prefCode: 13, prefName: "東京都" },
            { prefCode: 27, prefName: "大阪府" },
          ],
        });
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper });

    // ローディング表示を確認
    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();

    // データが取得され表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("都道府県選択")).toBeInTheDocument();
    });

    // 各都道府県のチェックボックスが表示されていることを確認
    expect(screen.getByLabelText("北海道を選択")).toBeInTheDocument();
    expect(screen.getByLabelText("東京都を選択")).toBeInTheDocument();
    expect(screen.getByLabelText("大阪府を選択")).toBeInTheDocument();

    // 初期状態では何も選択されていないことを確認
    expect(screen.getByTestId("selected-prefectures").textContent).toBe("選択中: ");
  });

  it("チェックボックスをクリックして都道府県を選択・解除できる", async () => {
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
    render(<TestComponent />, { wrapper });

    // データが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("都道府県選択")).toBeInTheDocument();
    });

    // 北海道のチェックボックスをクリック
    const hokkaidoCheckbox = screen.getByLabelText("北海道を選択");
    await user.click(hokkaidoCheckbox);

    // 選択状態が更新されることを確認
    expect(screen.getByTestId("selected-prefectures").textContent).toBe("選択中: 北海道");
    expect(hokkaidoCheckbox).toBeChecked();

    // 東京都も選択
    const tokyoCheckbox = screen.getByLabelText("東京都を選択");
    await user.click(tokyoCheckbox);

    // 選択状態が更新されることを確認（順序は考慮）
    const selectedContent = screen.getByTestId("selected-prefectures").textContent;
    expect(selectedContent).toContain("北海道");
    expect(selectedContent).toContain("東京都");
    expect(tokyoCheckbox).toBeChecked();

    // 北海道の選択を解除
    await user.click(hokkaidoCheckbox);

    // 選択状態が更新されることを確認
    expect(screen.getByTestId("selected-prefectures").textContent).toBe("選択中: 東京都");
    expect(hokkaidoCheckbox).not.toBeChecked();
    expect(tokyoCheckbox).toBeChecked();
  });

  it("APIエラー時にエラーメッセージを表示する", async () => {
    // エラーを返すハンドラーでモック
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.error();
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper });

    // ローディング表示を確認
    expect(screen.getByText("データを読み込み中...")).toBeInTheDocument();

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();
    });
  });

  it("空のデータが返された場合、適切なメッセージを表示する", async () => {
    // 空のデータを返すハンドラーでモック
    server.use(
      http.get(`${defaultConfig.baseURL}/prefectures`, () => {
        return HttpResponse.json({
          message: "正常に取得しました",
          result: [],
        });
      }),
    );

    const wrapper = createWrapper();
    render(<TestComponent />, { wrapper });

    // エラーメッセージが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("都道府県データが見つかりませんでした")).toBeInTheDocument();
    });
  });
});
