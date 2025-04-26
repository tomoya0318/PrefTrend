import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Prefecture } from "../../../types/domain/prefecture";
import { PrefectureCheckbox } from "../PrefectureCheckbox";

import "@testing-library/jest-dom";

describe("PrefectureCheckbox component", () => {
  const mockPrefecture: Prefecture = {
    prefCode: 1,
    prefName: "北海道",
  };

  const defaultProps = {
    prefecture: mockPrefecture,
    checked: false,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("正しくレンダリングされる", () => {
    render(<PrefectureCheckbox {...defaultProps} />);

    // チェックボックスが存在することを確認
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    // 都道府県名のラベルが表示されていることを確認
    const prefLabel = screen.getByText(mockPrefecture.prefName);
    expect(prefLabel).toBeInTheDocument();
  });

  test("チェック状態でレンダリングされる", () => {
    render(<PrefectureCheckbox {...defaultProps} checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("チェックボックスのIDが正しく設定される", () => {
    render(<PrefectureCheckbox {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", `pref-${mockPrefecture.prefCode}`);
  });

  test("aria-labelが正しく設定される", () => {
    render(<PrefectureCheckbox {...defaultProps} />);
    const checkbox = screen.getByLabelText(`${mockPrefecture.prefName}を選択`);
    expect(checkbox).toBeInTheDocument();
  });

  test("クリック時に正しい値でonChangeが呼ばれる", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<PrefectureCheckbox checked={false} prefecture={mockPrefecture} onChange={onChange} />);

    const checkbox = screen.getByRole("checkbox");

    // チェックボックスをクリック
    await user.click(checkbox);

    // 正しい引数でonChangeが呼ばれることを確認
    expect(onChange).toHaveBeenCalledWith(mockPrefecture.prefCode, true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("ラベルをクリックしてもチェックボックスが反応する", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(<PrefectureCheckbox checked={false} prefecture={mockPrefecture} onChange={onChange} />);

    // ラベルを見つけてクリック
    const label = screen.getByText(mockPrefecture.prefName);
    await user.click(label);

    // 正しい引数でonChangeが呼ばれることを確認
    expect(onChange).toHaveBeenCalledWith(mockPrefecture.prefCode, true);
  });

  test("異なる都道府県でもコンポーネントが正しく機能する", () => {
    const anotherPrefecture: Prefecture = {
      prefCode: 13,
      prefName: "東京都",
    };

    render(
      <PrefectureCheckbox
        checked={false}
        prefecture={anotherPrefecture}
        onChange={defaultProps.onChange}
      />,
    );

    // 東京都のラベルが表示されていることを確認
    const prefLabel = screen.getByText("東京都");
    expect(prefLabel).toBeInTheDocument();

    // チェックボックスのIDが正しく設定されていることを確認
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("id", "pref-13");

    // aria-labelも正しく設定されていることを確認
    expect(checkbox).toHaveAttribute("aria-label", "東京都を選択");
  });
});
