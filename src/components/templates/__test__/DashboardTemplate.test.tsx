import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { Prefecture } from "../../../types/domain/prefecture";
import type { DashboardTemplateProps } from "../DashboardTemplate";
import { DashboardTemplate } from "../DashboardTemplate";

// モックハンドラーをテスト外で定義
const mockOnPrefectureChange = vi.fn();

// PrefectureCheckboxListをモック化
vi.mock("../../organisms/PrefectureCheckboxList", () => ({
  PrefectureCheckboxList: ({
    prefectures,
    checkedPrefCodes,
    onPrefectureChange,
  }: DashboardTemplateProps) => {
    // モックコンポーネントがレンダリングされた時にonPrefectureChangeを1回呼び出す
    // これによりpropsとして伝達されているか確認できる
    if (onPrefectureChange) {
      // このテスト用の処理をするボタンを追加
      return (
        <div data-testid="prefecture-checkbox-list">
          <span data-testid="prefectures-count">{prefectures.length}</span>
          <span data-testid="checked-count">{checkedPrefCodes.length}</span>
          <button data-testid="test-handler-button" onClick={() => onPrefectureChange(1, true)}>
            Test Handler
          </button>
        </div>
      );
    }
    return null;
  },
}));

describe("DashboardTemplate component", () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: "北海道" },
    { prefCode: 2, prefName: "青森県" },
    { prefCode: 13, prefName: "東京都" },
  ];

  const defaultProps = {
    prefectures: mockPrefectures,
    checkedPrefCodes: [],
    onPrefectureChange: mockOnPrefectureChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("タイトルが正しく表示される", () => {
    render(<DashboardTemplate {...defaultProps} />);

    expect(screen.getByText("title")).toBeInTheDocument();
  });

  test("サブタイトル「都道府県」が表示される", () => {
    render(<DashboardTemplate {...defaultProps} />);

    expect(screen.getByText("都道府県")).toBeInTheDocument();
  });

  test("PrefectureCheckboxListコンポーネントに正しいpropsが渡される", () => {
    const checkedPrefCodes = [1, 13];
    render(<DashboardTemplate {...defaultProps} checkedPrefCodes={checkedPrefCodes} />);

    // モック化したコンポーネントに正しいデータが渡されているか確認
    expect(screen.getByTestId("prefectures-count").textContent).toBe(
      String(mockPrefectures.length),
    );
    expect(screen.getByTestId("checked-count").textContent).toBe(String(checkedPrefCodes.length));
  });

  test("onPrefectureChangeハンドラが正しく伝達される", () => {
    render(<DashboardTemplate {...defaultProps} />);

    // テスト用ボタンをクリックしてハンドラが呼ばれるかテスト
    const button = screen.getByTestId("test-handler-button");
    button.click();

    // ハンドラが正しく呼ばれたか確認
    expect(mockOnPrefectureChange).toHaveBeenCalledTimes(1);
    expect(mockOnPrefectureChange).toHaveBeenCalledWith(1, true);
  });

  test("メインコンテナにスタイルが適用されている", () => {
    const { container } = render(<DashboardTemplate {...defaultProps} />);

    // メインのdivが適切なスタイルクラスを持っているか確認
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("mx-10");
    expect(mainDiv).toHaveClass("my-10");
    expect(mainDiv).toHaveClass("border-2");
    expect(mainDiv).toHaveClass("border-primary");
  });

  test("タイトルに適切なスタイルが適用されている", () => {
    render(<DashboardTemplate {...defaultProps} />);

    const heading = screen.getByText("title");
    expect(heading).toHaveClass("mb-5");
    expect(heading).toHaveClass("border-b-2");
    expect(heading).toHaveClass("p-5");
    expect(heading).toHaveClass("text-2xl");
    expect(heading).toHaveClass("text-primary");
  });
});
