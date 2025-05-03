import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { ButtonProps } from "../Button";
import { Button } from "../Button";

describe("Button component", () => {
  const defaultProps: ButtonProps = {
    children: "テストボタン",
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("正しくレンダリングされる", () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole("button", { name: "テストボタン" });
    expect(button).toBeInTheDocument();
  });

  test("クリック時にonClickが呼ばれる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button {...defaultProps} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "テストボタン" });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("各variantが正しいクラスを適用する", () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");

    rerender(<Button {...defaultProps} variant="secondary" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");

    rerender(<Button {...defaultProps} variant="outline" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("border-primary");
    expect(button).toHaveClass("text-primary");
  });

  test("各sizeが正しいクラスを適用する", () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-3");
    expect(button).toHaveClass("py-1");
    expect(button).toHaveClass("text-sm");

    rerender(<Button {...defaultProps} size="md" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");

    rerender(<Button {...defaultProps} size="lg" />);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-6");
    expect(button).toHaveClass("py-3");
    expect(button).toHaveClass("text-lg");
  });

  test("デフォルトでvariantはprimaryが適用される", () => {
    render(<Button>{defaultProps.children}</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
  });

  test("デフォルトでsizeはmdが適用される", () => {
    render(<Button>{defaultProps.children}</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-4");
    expect(button).toHaveClass("py-2");
  });

  test("追加のclassNameが正しく適用される", () => {
    const className = "custom-class";
    render(<Button {...defaultProps} className={className} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(className);
    // 基本クラスも適用される
    expect(button).toHaveClass("rounded");
    expect(button).toHaveClass("transition-all");
  });

  test("キーボード操作をサポートする", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <div tabIndex={0}>前の要素</div>
        <Button onClick={onClick}>{defaultProps.children}</Button>
        <div tabIndex={0}>次の要素</div>
      </>,
    );

    // Tabキーでフォーカス
    await user.tab();
    await user.tab(); // ボタンにフォーカス

    const button = screen.getByRole("button");
    expect(button).toHaveFocus();

    // Enterキーで実行
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);

    // Spaceキーでも実行できる
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  test("フォーカス時のスタイルが適用される", async () => {
    const user = userEvent.setup();

    render(<Button {...defaultProps} />);
    const button = screen.getByRole("button");

    // Tabキーでフォーカス
    await user.tab();

    // focus:ring-2のようなスタイルはCSSの擬似クラスであり、
    // 直接テストは難しいため、フォーカス状態になることだけを確認
    expect(button).toHaveFocus();
  });
});
