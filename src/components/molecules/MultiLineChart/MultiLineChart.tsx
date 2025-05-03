import { PopulationByYear } from "@/types/domain/chart";

import { Chart } from "@/components/atoms/Chart";
import { ChartLineProps } from "@/components/atoms/Chart";

export interface MultiLineChartProps {
  data: PopulationByYear[];
  lines: ChartLineProps[];
}

/**
 * MultiLineChart - 複数の線を持つグラフを描画するコンポーネント
 * @param {PopulationByYear[]} data - グラフに表示するデータ
 * @param {ChartLineProps[]} lines - グラフに表示する線の情報
 **/

export function MultiLineChart({ data }: { data: PopulationByYear[] }) {
  // データから都道府県名の配列を取得（yearを除く）
  const prefNames = Object.keys(data[0]).filter((key) => key !== "year");
  if (prefNames.length === 0) {
    return <div className="py-10 text-center">都道府県データが見つかりません</div>;
  }

  // CSS変数からグラフカラーを取得する関数
  const getGraphColor = (index: number): string => {
    // CSS変数を使用して色を取得（1から8までの範囲で循環）
    const colorIndex = (index % 8) + 1;
    return `var(--color-graph-${colorIndex})`;
  };

  // 各都道府県に対して線の情報を生成
  const lines: ChartLineProps[] = prefNames.map((prefecture, index) => {
    return {
      dataKey: prefecture,
      name: prefecture,
      color: getGraphColor(index), // CSS変数から色を取得
    };
  });

  return <Chart data={data} lines={lines} />;
}
