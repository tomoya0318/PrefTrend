import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { CheckboxProps } from "../Checkbox";
import { Checkbox } from "../Checkbox";

describe("Checkbox component", () => {
  const defaultProps: CheckboxProps = {
    checked: false,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("正しくレンダリングされる", () => {
    render(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test("チェック状態でレンダリングされる", () => {
    render(<Checkbox {...defaultProps} checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("クリック時に正しい値でonChangeが呼ばれる", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <Checkbox aria-label="テストチェックボックス" checked={false} onChange={onChange} />,
    );
    const checkbox = screen.getByRole("checkbox");

    // 最初のクリック: false -> true
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);

    // Reactの実際の動作では、propsを更新する必要があるため、
    // 再レンダリングをシミュレートします
    onChange.mockClear();
    rerender(<Checkbox aria-label="テストチェックボックス" checked={true} onChange={onChange} />);

    // 2回目のクリック: true -> false
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("disabled propがtrueの場合は無効になる", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox checked={false} disabled={true} onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
    await user.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  test("提供されたclassNameとデフォルトのスタイリングクラスが適用される", () => {
    const className = "test-class";
    render(<Checkbox {...defaultProps} className={className} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toHaveClass(className);
    // デフォルトのスタイリングクラスも確認
    expect(checkbox).toHaveClass("rounded");
    expect(checkbox).toHaveClass("border-gray-300");
  });

  test("aria-labelが正しく設定される", () => {
    const ariaLabel = "Test checkbox";
    render(<Checkbox {...defaultProps} aria-label={ariaLabel} />);
    const checkbox = screen.getByLabelText(ariaLabel);
    expect(checkbox).toBeInTheDocument();
  });

  test("キーボード操作をサポートする", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <div tabIndex={0}>前の要素</div>
        <Checkbox checked={false} onChange={onChange} />
        <div tabIndex={0}>次の要素</div>
      </>,
    );

    // Tabキーでフォーカス
    await user.tab();
    await user.tab(); // チェックボックスにフォーカス

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveFocus();

    // Spaceキーで選択
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("外部ラベルとidを介して正しくリンクする", async () => {
    const id = "test-checkbox-id";
    const labelText = "チェックボックスラベル";
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <label htmlFor={id}>{labelText}</label>
        <Checkbox {...defaultProps} id={id} onChange={onChange} />
      </>,
    );

    // ラベルをクリックしてチェックボックスが反応するか
    const label = screen.getByText(labelText);
    await user.click(label);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("無効状態のスタイリングが正しくレンダリングされる", () => {
    render(<Checkbox {...defaultProps} disabled={true} />);
    const checkbox = screen.getByRole("checkbox");

    // 無効状態のスタイルクラスを確認
    expect(checkbox).toHaveClass("opacity-50");
    expect(checkbox).toHaveClass("cursor-not-allowed");
  });
});
