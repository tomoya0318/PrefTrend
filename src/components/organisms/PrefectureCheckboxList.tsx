import { Prefecture } from "@/types/domain/prefecture";
import { ApiError } from "@/types/errors";

import { PrefectureCheckbox } from "@/components/molecules/PrefectureCheckbox";

import { ErrorMessage } from "../molecules/ErrorMessage";
import { Loading } from "../molecules/Loading";

interface PrefectureCheckboxListProps {
  prefectures?: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * 都道府県チェックボックスリストコンポーネント
 * @param prefectures - 都道府県データの配列
 * @param checkedPrefCodes - チェックされた都道府県コードの配列
 * @param onPrefectureChange - チェック状態変更時のコールバック
 */
export function PrefectureCheckboxList({
  prefectures,
  checkedPrefCodes,
  onPrefectureChange,
  isLoading,
  error,
  refetch,
}: PrefectureCheckboxListProps) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorMessage
          message="人口データの取得中にエラーが発生しました"
          onClick={() => refetch()}
        />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }
  if (!prefectures || prefectures.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorMessage
          message="都道府県データが見つかりませんでした"
          title="データが見つかりません"
          onClick={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {prefectures.map((prefecture) => (
        <PrefectureCheckbox
          key={prefecture.prefCode}
          checked={checkedPrefCodes.includes(prefecture.prefCode)}
          prefecture={prefecture}
          onChange={onPrefectureChange}
        />
      ))}
    </div>
  );
}
