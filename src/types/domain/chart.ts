/**
 * グラフデータ表示用の年ベースの人口データ型
 * 年をキーとして各都道府県の人口データを保持する
 */
export interface PopulationByYear {
  year: number;
  [prefName: string]: number;
}
