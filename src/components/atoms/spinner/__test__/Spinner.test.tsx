import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { SpinnerProps } from "../Spinner";
import { Spinner } from "../Spinner";

describe("Spinner component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("正しくレンダリングされる", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "loading");
  });

  test("各サイズのスピナーが正しく表示される", () => {
    const sizes: SpinnerProps["size"][] = ["sm", "md", "lg"];

    sizes.forEach((size) => {
      const { rerender } = render(<Spinner size={size} />);
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
    const colors: SpinnerProps["color"][] = ["primary", "secondary"];

    colors.forEach((color) => {
      const { rerender } = render(<Spinner color={color} />);
      const spinner = screen.getByRole("status");

      expect(spinner.className).toContain(`border-${color}`);

      rerender(<div />); // クリーンアップ
    });
  });

  test("カスタムクラス名が追加される", () => {
    const customClassName = "custom-class-name";
    render(<Spinner className={customClassName} />);

    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain(customClassName);
  });
});
