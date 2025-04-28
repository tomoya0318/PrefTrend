// 単一の人口データ
export interface Population {
  year: number;
  value: number;
  rate?: number;
}

// 人口構成データ
export interface PopulationCategory {
  label: string;
  data: Population[];
}

// 人口データ
export interface PopulationData {
  boundaryYear: number;
  data: PopulationCategory[];
}
