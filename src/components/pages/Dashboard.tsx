import { useState } from "react";

import { DashboardTemplate } from "@/components/templates/DashboardTemplate";

import { useGetPrefectures } from "@/hooks/useGetPrefectures";
import { usePrefecturePopulation } from "@/hooks/usePrefecturePopulation";

export type PopulationType = "総人口" | "年少人口" | "生産年齢人口" | "老年人口";
export const POPULATION_TYPES: { value: PopulationType; label: string }[] = [
  { value: "総人口", label: "総人口" },
  { value: "年少人口", label: "年少人口" },
  { value: "生産年齢人口", label: "生産年齢人口" },
  { value: "老年人口", label: "老年人口" },
];

export function Dashboard() {
  const [selectedPopulationType, setSelectedPopulationType] = useState<PopulationType>("総人口");
  // React Queryを使用して都道府県データを取得
  const {
    prefectures,
    isLoading: isPrefLoading,
    error: prefError,
    refetch: prefRefech,
  } = useGetPrefectures();

  const handlePopulationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPopulationType(e.target.value as PopulationType);
  };

  // 都道府県選択状態をURLクエリパラメータで管理
  const {
    checkedPrefCodes,
    handlePrefectureChange,
    populationData,
    isLoading: isPopulationLoading,
    hasError: populationHasError,
  } = usePrefecturePopulation(prefectures || [], selectedPopulationType);

  // データがロードできた場合、テンプレートを表示
  return (
    <DashboardTemplate
      checkedPrefCodes={checkedPrefCodes}
      isPrefError={prefError}
      isPrefLoading={isPrefLoading}
      isPrefRefetch={prefRefech}
      populationData={populationData}
      populationTypeOptions={POPULATION_TYPES}
      prefectures={prefectures}
      selectedPopulationType={selectedPopulationType}
      onPopulationTypeChange={handlePopulationTypeChange}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}
