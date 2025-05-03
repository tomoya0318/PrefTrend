export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary";
  className?: string;
}

/**
 * Spinner - ローディングスピナーatomコンポーネント
 * @param size - スピナーのサイズ（sm, md, lg）
 * @param color - スピナーの色（primary, secondary）
 * @param className - 追加のCSSクラス
 */
export function Spinner({ size = "md", color = "primary", className = "" }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-4",
  };

  return (
    <div
      aria-label="loading"
      className={`animate-spin rounded-full border-t-transparent ${sizes[size]} border-${color} ${className}`}
      role="status"
    />
  );
}
