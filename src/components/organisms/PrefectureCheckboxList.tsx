import { Prefecture } from "../../types/api/prefecture";
import { PrefectureCheckbox } from "../molecules/PrefectureCheckbox";

interface PrefectureCheckboxListProps {
  prefectures: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
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
}: PrefectureCheckboxListProps) {
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
