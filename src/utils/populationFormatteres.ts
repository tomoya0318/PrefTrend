import { PopulationByYear } from "@/types/domain/chart";
import { Population, PopulationCategory } from "@/types/domain/population";
import { Prefecture } from "@/types/domain/prefecture";

import { ResultWithPrefCode } from "@/hooks/useGetPopulation";

interface PopulationByPrefName {
  prefCode: number;
  prefName: string;
  populations: Population[];
}

// 都道府県コードから都道府県名を取得する関数
const getPrefNameByCode = (prefCode: number, prefectures: Prefecture[] | undefined): string => {
  if (!prefectures || !Array.isArray(prefectures)) {
    return "Unknown Prefecture";
  }
  const prefecture = prefectures.find((pref) => pref.prefCode === prefCode);
  return prefecture ? prefecture.prefName : "Unknown Prefecture";
};

const findCategoryByLabel = (
  label: string,
  populationCategories: PopulationCategory[] | undefined,
): PopulationCategory | undefined => {
  // 配列が存在しない場合は undefined を返す
  if (!populationCategories) {
    return undefined;
  }

  // ラベルに一致するカテゴリーを返す（なければundefined）
  return populationCategories.find((category) => category.label === label);
};

const transformToYearBasedData = (populationData: PopulationByPrefName[]): PopulationByYear[] => {
  // 年ごとにデータを集約するマップ
  const yearMap = new Map<number, Record<string, number>>();

  // 各都道府県のデータを処理
  populationData.forEach(({ prefName, populations }) => {
    populations.forEach(({ year, value }) => {
      // 当該年のデータがまだない場合は初期化
      if (!yearMap.has(year)) {
        yearMap.set(year, { year });
      }

      // 年のデータに都道府県の値を追加
      const yearData = yearMap.get(year)!;
      yearData[prefName] = value;
    });
  });

  return Array.from(yearMap.entries()).map(([year, values]) => ({
    year,
    ...values,
  }));
};

// prefNameとデータに対応した形式に変換
const formatPopulationByPrefecture = (
  populationCompositions: ResultWithPrefCode[],
  prefectures: Prefecture[],
  label: string,
): PopulationByPrefName[] => {
  return populationCompositions.map((result) => {
    const prefCode = result.prefCode;
    const prefName = getPrefNameByCode(result.prefCode, prefectures);
    const category = findCategoryByLabel(label, result.data?.data);
    return {
      prefCode,
      prefName,
      populations: category?.data || [],
    };
  });
};

export const preparePopulationData = (
  populationCompositions: ResultWithPrefCode[],
  prefectures: Prefecture[],
  label: string,
): PopulationByYear[] => {
  const populationData = formatPopulationByPrefecture(populationCompositions, prefectures, label);
  return transformToYearBasedData(populationData);
};
