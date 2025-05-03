import { useGetPopulation } from "./useGetPopulation";
import { usePrefectureSelection } from "./usePrefectureSelection";

/**
 * 選択された都道府県の人口データを取得するカスタムフック
 * 都道府県の選択とそれに基づく人口データ取得を統合します
 */
export function usePrefecturePopulation() {
  // 都道府県選択状態の管理
  const { checkedPrefCodes, handlePrefectureChange } = usePrefectureSelection();

  // 選択された都道府県の人口データを取得
  const {
    results: populationCompositions,
    isLoading,
    hasError,
  } = useGetPopulation(checkedPrefCodes);

  return {
    // 都道府県選択関連
    checkedPrefCodes,
    handlePrefectureChange,

    // 人口データ関連
    populationCompositions,
    isLoading,
    hasError,
  };
}
