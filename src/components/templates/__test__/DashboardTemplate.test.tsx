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
        <div className="prefecture-checkbox-list">
          <span aria-label="都道府県の総数" className="prefectures-count">
            {prefectures.length}
          </span>
          <span aria-label="選択済み都道府県数" className="checked-count">
            {checkedPrefCodes.length}
          </span>
          <button
            aria-label="テストハンドラー"
            className="test-handler-button"
            onClick={() => onPrefectureChange(1, true)}
          >
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

    expect(screen.getByLabelText("ダッシュボードタイトル")).toHaveTextContent("title");
  });

  test("サブタイトル「都道府県」が表示される", () => {
    render(<DashboardTemplate {...defaultProps} />);

    expect(screen.getByLabelText("都道府県セクション")).toHaveTextContent("都道府県");
  });

  test("PrefectureCheckboxListコンポーネントに正しいpropsが渡される", () => {
    const checkedPrefCodes = [1, 13];
    render(<DashboardTemplate {...defaultProps} checkedPrefCodes={checkedPrefCodes} />);

    // モック化したコンポーネントに正しいデータが渡されているか確認
    expect(screen.getByLabelText("都道府県の総数")).toHaveTextContent(
      String(mockPrefectures.length),
    );
    expect(screen.getByLabelText("選択済み都道府県数")).toHaveTextContent(
      String(checkedPrefCodes.length),
    );
  });

  test("onPrefectureChangeハンドラが正しく伝達される", () => {
    render(<DashboardTemplate {...defaultProps} />);

    // テスト用ボタンをクリックしてハンドラが呼ばれるかテスト
    const button = screen.getByRole("button", { name: "テストハンドラー" });
    button.click();

    // ハンドラが正しく呼ばれたか確認
    expect(mockOnPrefectureChange).toHaveBeenCalledTimes(1);
    expect(mockOnPrefectureChange).toHaveBeenCalledWith(1, true);
  });

  test("メインコンテナにスタイルが適用されている", () => {
    render(<DashboardTemplate {...defaultProps} />);

    // メインのdivが適切なスタイルクラスを持っているか確認
    const mainDiv = screen.getByLabelText("ダッシュボード");
    expect(mainDiv).toHaveClass("mx-10");
    expect(mainDiv).toHaveClass("my-10");
    expect(mainDiv).toHaveClass("border-2");
    expect(mainDiv).toHaveClass("border-primary");
  });

  test("タイトルに適切なスタイルが適用されている", () => {
    render(<DashboardTemplate {...defaultProps} />);

    const heading = screen.getByLabelText("ダッシュボードタイトル");
    expect(heading).toHaveClass("mb-5");
    expect(heading).toHaveClass("border-b-2");
    expect(heading).toHaveClass("p-5");
    expect(heading).toHaveClass("text-2xl");
    expect(heading).toHaveClass("text-primary");
  });
});
