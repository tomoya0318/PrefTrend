import { MemoryRouter, Route, Routes } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PrefectureCheckboxList } from "../../../components/organisms/PrefectureCheckboxList";
import { usePrefectureSelection } from "../../../hooks/usePrefectureSelection";
import { Prefecture } from "../../../types/domain/prefecture";

// テスト用のラッパーコンポーネント
// 実際のPrefectureCheckboxListを使用
function TestComponent() {
  const { checkedPrefCodes, handlePrefectureChange } = usePrefectureSelection();

  // テスト用の都道府県データ
  const prefectures: Prefecture[] = [
    { prefCode: 13, prefName: "東京都" },
    { prefCode: 27, prefName: "大阪府" },
    { prefCode: 14, prefName: "神奈川県" },
  ];

  return (
    <div>
      <div data-testid="checked-codes">{checkedPrefCodes.join(",")}</div>
      <PrefectureCheckboxList
        checkedPrefCodes={checkedPrefCodes}
        prefectures={prefectures}
        onPrefectureChange={handlePrefectureChange}
      />
    </div>
  );
}

// カスタムレンダーヘルパー関数
function renderWithRouter(initialPath: string = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<TestComponent />} path="*" />
      </Routes>
    </MemoryRouter>,
  );
}

describe("usePrefectureSelection (統合テスト)", () => {
  it("初期状態では選択された都道府県がない", () => {
    renderWithRouter();
    expect(screen.getByTestId("checked-codes").textContent).toBe("");
  });

  it("URLからprefCodeパラメータを正しく読み取る", () => {
    renderWithRouter("/?prefCode=13,27");
    expect(screen.getByTestId("checked-codes").textContent).toBe("13,27");

    // チェックボックスの状態も確認
    const tokyoCheckbox = screen.getByLabelText("東京都を選択") as HTMLInputElement;
    const osakaCheckbox = screen.getByLabelText("大阪府を選択") as HTMLInputElement;

    expect(tokyoCheckbox.checked).toBe(true);
    expect(osakaCheckbox.checked).toBe(true);
  });

  it("不正な値はフィルタリングする", () => {
    renderWithRouter("/?prefCode=13,abc,27");
    expect(screen.getByTestId("checked-codes").textContent).toBe("13,27");
  });

  it("チェックボックスをクリックして都道府県を追加できる", () => {
    renderWithRouter();

    // 東京のチェックボックスをクリック
    const tokyoCheckbox = screen.getByLabelText("東京都を選択");
    fireEvent.click(tokyoCheckbox);

    expect(screen.getByTestId("checked-codes").textContent).toBe("13");

    // 大阪のチェックボックスをクリック
    const osakaCheckbox = screen.getByLabelText("大阪府を選択");
    fireEvent.click(osakaCheckbox);

    expect(screen.getByTestId("checked-codes").textContent).toBe("13,27");
  });

  it("チェックボックスをクリックして都道府県を削除できる", () => {
    renderWithRouter("/?prefCode=13,27");

    // 東京のチェックボックスをクリック（チェックを外す）
    const tokyoCheckbox = screen.getByLabelText("東京都を選択");
    fireEvent.click(tokyoCheckbox);

    expect(screen.getByTestId("checked-codes").textContent).toBe("27");
  });

  it("すべての都道府県のチェックを外すと、prefCodeパラメータを削除する", () => {
    renderWithRouter("/?prefCode=13");

    // 東京のチェックボックスをクリック（チェックを外す）
    const tokyoCheckbox = screen.getByLabelText("東京都を選択");
    fireEvent.click(tokyoCheckbox);

    expect(screen.getByTestId("checked-codes").textContent).toBe("");

    // URLからprefCodeパラメータが削除されることを確認
    expect(window.location.search).toBe("");
  });
});
