import { ApiError } from "../../../types/errors";
import { Button } from "../../atoms/Button";

export interface ErrorMessageProps {
  error?: ApiError;
  message?: string;
  title?: string;
  onClick: () => void;
  className?: string;
}

/**
 * ErrorMessage - エラーメッセージatomコンポーネント
 * @param error - エラーオブジェクト（任意）
 * @param message - カスタムエラーメッセージ（指定しない場合はerrorオブジェクトのメッセージを使用）
 * @param title - エラータイトル（デフォルト: "エラーが発生しました"）
 * @param onClick - 再読み込みボタンのクリックハンドラ
 * @param className - 追加のCSSクラス
 */
export function ErrorMessage({
  error,
  message,
  title = "エラーが発生しました",
  onClick,
  className = "",
}: ErrorMessageProps) {
  // エラーメッセージの優先順位: 明示的に渡されたmessage > errorオブジェクトのmessage
  const displayMessage = message || (error?.message ?? "不明なエラーが発生しました");

  return (
    <div className={`text-center text-lg text-error ${className}`}>
      <h2>{title}</h2>
      <p>{displayMessage}</p>
      <div className="mt-4">
        <Button onClick={onClick}>再読み込み</Button>
      </div>
    </div>
  );
}
