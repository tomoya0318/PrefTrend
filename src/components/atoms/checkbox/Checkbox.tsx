import React from "react";

export interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Checkbox - 基本的なチェックボックスatomコンポーネント
 * @param id - チェックボックスのID（ラベルとの関連付けに使用）
 * @param checked - チェック状態
 * @param onChange - チェック状態変更時のコールバック
 * @param disabled - 無効状態
 * @param className - 追加のCSSクラス
 * @param ariaLabel - アクセシビリティラベル
 * @param props - その他のプロパティ
 */
export default function Checkbox({
  id,
  checked,
  onChange,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  ...props
}: CheckboxProps) {
  // チェック状態変更のハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <input
      aria-label={ariaLabel}
      checked={checked}
      className={`h-4 w-4 rounded border-gray-300 text-primary transition-all focus:ring-2 focus:ring-primary ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary"} ${className} `}
      disabled={disabled}
      id={id}
      type="checkbox"
      onChange={handleChange}
      {...props}
    />
  );
}
