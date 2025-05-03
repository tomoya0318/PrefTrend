import { Prefecture } from "@/types/domain/prefecture";

import { useGetPopulation } from "@/hooks/useGetPopulation";
import { usePrefectureSelection } from "@/hooks/usePrefectureSelection";
import { preparePopulationData } from "@/utils/populationFormatteres";
/**
 * 選択された都道府県の人口データを取得するカスタムフック
 * 都道府県の選択とそれに基づく人口データ取得を統合します
 * @param prefectures - 都道府県データの配列（省略可能）
 * @param label - 表示するデータのラベル（総人口など）
 */

export function usePrefecturePopulation(prefectures: Prefecture[], label: string) {
  // 都道府県選択状態の管理（都道府県データを渡す）
  const { checkedPrefCodes, handlePrefectureChange } = usePrefectureSelection();

  // 選択された都道府県の人口データを取得
  const {
    results: populationCompositions,
    isLoading,
    hasError,
  } = useGetPopulation(checkedPrefCodes);

  const populationData = preparePopulationData(populationCompositions, prefectures, label);
  return {
    // 都道府県選択関連
    checkedPrefCodes,
    handlePrefectureChange,

    // 人口データ関連
    populationData,
    isLoading,
    hasError,
  };
}
