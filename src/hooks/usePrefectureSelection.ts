import { useSearchParams } from "react-router-dom";

export function usePrefectureSelection() {
  // URLクエリパラメータを管理
  const [searchParams, setSearchParams] = useSearchParams();

  // クエリパラメータから選択された都道府県コードを取得
  const getCheckedPrefCodes = (): number[] => {
    const prefCodeParam = searchParams.get("prefCode");
    if (!prefCodeParam) return [];

    // カンマ区切りの文字列をパースして数値の配列に変換
    return prefCodeParam
      .split(",")
      .map((code) => parseInt(code, 10))
      .filter((code) => !isNaN(code));
  };

  // 現在選択されている都道府県コードの配列
  const checkedPrefCodes = getCheckedPrefCodes();

  // チェックボックスの変更を処理する関数
  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    const currentCodes = getCheckedPrefCodes();
    let newCodes: number[];

    if (checked) {
      // 新しい都道府県コードを追加
      newCodes = [...currentCodes, prefCode];
    } else {
      // 都道府県コードを削除
      newCodes = currentCodes.filter((code) => code !== prefCode);
    }

    // URLを更新
    if (newCodes.length > 0) {
      setSearchParams({ prefCode: newCodes.join(",") });
    } else {
      // 選択がない場合はクエリパラメータを削除
      searchParams.delete("prefCode");
      setSearchParams(searchParams);
    }
  };

  return {
    checkedPrefCodes,
    handlePrefectureChange,
  };
}
