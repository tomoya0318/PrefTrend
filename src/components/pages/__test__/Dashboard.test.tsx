// filepath: /Users/tomoya-n/dev/PrefTrend/src/components/pages/__test__/Dashboard.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import type { DashboardTemplateProps } from "../../templates/DashboardTemplate";
import { Dashboard } from "../Dashboard";

import "@testing-library/jest-dom";

// DashboardTemplateをモック化
jest.mock("../../templates/DashboardTemplate", () => ({
  DashboardTemplate: ({
    prefectures,
    checkedPrefCodes,
    onPrefectureChange,
  }: DashboardTemplateProps) => {
    return (
      <div data-testid="dashboard-template">
        <span data-testid="prefectures-count">{prefectures.length}</span>
        <span data-testid="checked-count">{checkedPrefCodes.length}</span>
        <button
          data-testid="toggle-hokkaido"
          onClick={() => onPrefectureChange(1, !checkedPrefCodes.includes(1))}
        >
          Toggle Hokkaido
        </button>
        <button
          data-testid="toggle-tokyo"
          onClick={() => onPrefectureChange(13, !checkedPrefCodes.includes(13))}
        >
          Toggle Tokyo
        </button>
      </div>
    );
  },
}));

describe("Dashboard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("初期状態では選択された都道府県がない", () => {
    render(<Dashboard />);

    // チェックされた都道府県の数が0であることを確認
    expect(screen.getByTestId("checked-count").textContent).toBe("0");
  });

  test("都道府県データがDashboardTemplateに正しく渡される", () => {
    render(<Dashboard />);

    // mockPrefecturesの長さ（10）が正しく渡されていることを確認
    expect(screen.getByTestId("prefectures-count").textContent).toBe("10");
  });

  test("都道府県を選択するとcheckedPrefCodesが更新される", async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // 初期状態では選択されている都道府県がない
    expect(screen.getByTestId("checked-count").textContent).toBe("0");

    // 北海道を選択する
    await user.click(screen.getByTestId("toggle-hokkaido"));

    // 選択された都道府県が1つになる
    expect(screen.getByTestId("checked-count").textContent).toBe("1");
  });

  test("複数の都道府県を選択できる", async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // 初期状態では選択されている都道府県がない
    expect(screen.getByTestId("checked-count").textContent).toBe("0");

    // 北海道を選択する
    await user.click(screen.getByTestId("toggle-hokkaido"));
    // 東京を選択する
    await user.click(screen.getByTestId("toggle-tokyo"));

    // 選択された都道府県が2つになる
    expect(screen.getByTestId("checked-count").textContent).toBe("2");
  });

  test("選択した都道府県のチェックを外すとcheckedPrefCodesから削除される", async () => {
    const user = userEvent.setup();
    render(<Dashboard />);

    // 北海道を選択する
    await user.click(screen.getByTestId("toggle-hokkaido"));
    // 東京を選択する
    await user.click(screen.getByTestId("toggle-tokyo"));

    // 選択された都道府県が2つになる
    expect(screen.getByTestId("checked-count").textContent).toBe("2");

    // 北海道の選択を解除する
    await user.click(screen.getByTestId("toggle-hokkaido"));

    // 選択された都道府県が1つになる
    expect(screen.getByTestId("checked-count").textContent).toBe("1");
  });
});
