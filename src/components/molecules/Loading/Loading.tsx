import { Spinner } from "@/components/atoms/spinner";

export interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary";
  className?: string;
}

/**
 * Loading - ローディングスピナーatomコンポーネント
 * @param size - スピナーのサイズ（sm, md, lg）
 * @param color - スピナーの色（primary, secondary）
 * @param className - 追加のCSSクラス
 */
export function Loading({ size = "md", color = "primary", className = "" }: LoadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center">
        <Spinner color={color} size={size} />
      </div>
      <p className="text-lg">データを読み込み中...</p>
    </div>
  );
}
