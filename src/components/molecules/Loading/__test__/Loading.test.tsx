import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { LoadingProps } from "../Loading";
import { Loading } from "../Loading";

describe("Loading component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("正しくレンダリングされる", () => {
    render(<Loading />);

    // スピナーが存在することを確認
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();

    // ローディングメッセージが存在することを確認
    const message = screen.getByText("データを読み込み中...");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass("text-lg");
  });

  test("各サイズのスピナーが正しく表示される", () => {
    const sizes: LoadingProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { rerender } = render(<Loading size={size} />);
      const spinner = screen.getByRole("status");

      if (size === "sm") {
        expect(spinner.className).toContain("h-4 w-4 border-2");
      } else if (size === "md") {
        expect(spinner.className).toContain("h-6 w-6 border-2");
      } else if (size === "lg") {
        expect(spinner.className).toContain("h-8 w-8 border-4");
      }

      rerender(<div />); // クリーンアップ
    });
  });

  test("異なる色のスピナーが正しく表示される", () => {
    const colors: LoadingProps["color"][] = ["primary", "secondary"];

    colors.forEach((color) => {
      const { rerender } = render(<Loading color={color} />);
      const spinner = screen.getByRole("status");

      expect(spinner.className).toContain(`border-${color}`);

      rerender(<div />); // クリーンアップ
    });
  });

  test("カスタムクラス名が追加される", () => {
    const customClassName = "custom-test-class";
    render(<Loading className={customClassName} />);

    const container = screen.getByText("データを読み込み中...").parentElement;
    expect(container).toHaveClass(customClassName);
    expect(container).toHaveClass("text-center");
  });
});
