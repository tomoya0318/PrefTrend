import { DashboardTemplate } from "@/components/templates/DashboardTemplate";

import { useGetPrefectures } from "@/hooks/useGetPrefectures";
import { usePrefecturePopulation } from "@/hooks/usePrefecturePopulation";

export function Dashboard() {
  // React Queryを使用して都道府県データを取得
  const {
    prefectures,
    isLoading: isPrefLoading,
    error: prefError,
    refetch: prefRefech,
  } = useGetPrefectures();

  // 都道府県選択状態をURLクエリパラメータで管理
  const {
    checkedPrefCodes,
    handlePrefectureChange,
    populationData,
    isLoading: isPopulationLoading,
    hasError: populationHasError,
  } = usePrefecturePopulation(prefectures || [], "総人口");

  // データがロードできた場合、テンプレートを表示
  return (
    <DashboardTemplate
      checkedPrefCodes={checkedPrefCodes}
      isPrefError={prefError}
      isPrefLoading={isPrefLoading}
      isPrefRefetch={prefRefech}
      populationData={populationData}
      prefectures={prefectures}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}
