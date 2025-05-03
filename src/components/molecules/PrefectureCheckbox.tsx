import { Prefecture } from "../../types/domain/prefecture";
import { Checkbox } from "../atoms/Checkbox";

interface PrefectureCheckboxProps {
  prefecture: Prefecture;
  checked: boolean;
  onChange: (prefCode: number, checked: boolean) => void;
}
/**
 * 都道府県チェックボックスコンポーネント
 * @param prefecture - 都道府県データを受け取るオブジェクト
 * @param checked - チェック状態
 * @param onChange - チェック状態変更時のコールバック
 */
export function PrefectureCheckbox({ prefecture, checked, onChange }: PrefectureCheckboxProps) {
  const { prefCode, prefName } = prefecture;

  const handleChange = (isChecked: boolean) => {
    onChange(prefCode, isChecked);
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        aria-label={`${prefName}を選択`}
        checked={checked}
        id={`pref-${prefCode}`}
        onChange={handleChange}
      />
      <label className="" htmlFor={`pref-${prefCode}`}>
        {prefName}
      </label>
    </div>
  );
}
