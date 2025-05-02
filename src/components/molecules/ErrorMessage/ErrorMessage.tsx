import { ApiError } from "../../../types/errors";
import { Button } from "../../atoms/Button";

export interface ErrorMessageProps {
  error: ApiError;
  onClick: () => void;
  className?: string;
}

/**
 * ErrorMessage - エラーメッセージatomコンポーネント
 * @param error - エラーオブジェクト
 * @param className - 追加のCSSクラス
 */
export function ErrorMessage({ error, onClick, className = "" }: ErrorMessageProps) {
  return (
    <div className={`text-center text-lg text-error ${className}`}>
      <h2>エラーが発生しました</h2>
      <p>{error.message}</p>
      <div className="mt-4">
        <Button onClick={onClick}>再読み込み</Button>
      </div>
    </div>
  );
}
