import React from "react";

export interface CheckboxProps {
  /**
   * チェックボックスのID（ラベルとの関連付けに使用）
   */
  id?: string;
  /**
   * チェック状態
   */
  checked: boolean;
  /**
   * チェック状態変更時のコールバック
   */
  onChange: (checked: boolean) => void;
  /**
   * 無効状態
   */
  disabled?: boolean;
  /**
   * 追加のCSSクラス
   */
  className?: string;
  /**
   * アクセシビリティラベル
   */
  "aria-label"?: string;
  /**
   * テスト用のdata属性
   */
  "data-testid"?: string;
}

/**
 * Checkbox - 基本的なチェックボックスatomコンポーネント
 */
export function Checkbox({
  id,
  checked,
  onChange,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
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
      data-testid={dataTestId}
      disabled={disabled}
      id={id}
      type="checkbox"
      onChange={handleChange}
      {...props}
    />
  );
}
