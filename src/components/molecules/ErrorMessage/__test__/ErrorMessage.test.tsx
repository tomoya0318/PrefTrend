import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { ErrorMessage, ErrorMessageProps } from "../ErrorMessage";

describe("ErrorMessage component", () => {
  const mockAxiosError = new AxiosError("Network Error");

  const defaultProps: ErrorMessageProps = {
    error: {
      status: 500,
      message: "サーバーエラーが発生しました",
      originalError: mockAxiosError,
    },
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("正しくレンダリングされる", () => {
    render(<ErrorMessage {...defaultProps} />);

    // タイトルが表示されている
    expect(screen.getByText("エラーが発生しました")).toBeInTheDocument();

    // エラーメッセージが表示されている
    expect(screen.getByText("サーバーエラーが発生しました")).toBeInTheDocument();

    // 再読み込みボタンが表示されている
    expect(screen.getByRole("button", { name: "再読み込み" })).toBeInTheDocument();
  });

  test("再読み込みボタンをクリックするとonClickが呼ばれる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ErrorMessage {...defaultProps} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "再読み込み" });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("追加のclassNameが正しく適用される", () => {
    const className = "custom-error";
    render(<ErrorMessage {...defaultProps} className={className} />);

    const errorContainer = screen.getByText("エラーが発生しました").closest("div");
    expect(errorContainer).toHaveClass(className);
    expect(errorContainer).toHaveClass("text-lg");
    expect(errorContainer).toHaveClass("text-center");
    expect(errorContainer).toHaveClass("text-error");
  });

  test("エラーメッセージが動的に変わる", () => {
    const customError = {
      status: 404,
      message: "データが見つかりませんでした",
      originalError: new Error("Not Found"),
    };

    const { rerender } = render(<ErrorMessage {...defaultProps} />);
    expect(screen.getByText("サーバーエラーが発生しました")).toBeInTheDocument();

    rerender(<ErrorMessage {...defaultProps} error={customError} />);
    expect(screen.getByText("データが見つかりませんでした")).toBeInTheDocument();
  });

  test("キーボード操作でボタンがクリックできる", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<ErrorMessage {...defaultProps} onClick={onClick} />);

    const button = screen.getByRole("button", { name: "再読み込み" });
    await user.tab(); // ボタンにフォーカス
    expect(button).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("カスタムタイトルとメッセージが表示される", () => {
    const customTitle = "データが見つかりません";
    const customMessage = "都道府県データが見つかりませんでした";

    render(<ErrorMessage message={customMessage} title={customTitle} onClick={vi.fn()} />);

    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  test("errorとmessageが両方指定された場合、messageが優先される", () => {
    const customMessage = "カスタムエラーメッセージ";

    render(<ErrorMessage error={defaultProps.error} message={customMessage} onClick={vi.fn()} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.queryByText(defaultProps.error?.message ?? "")).not.toBeInTheDocument();
  });

  test("errorもmessageも指定されない場合、デフォルトメッセージが表示される", () => {
    render(<ErrorMessage onClick={vi.fn()} />);

    expect(screen.getByText("不明なエラーが発生しました")).toBeInTheDocument();
  });
});
