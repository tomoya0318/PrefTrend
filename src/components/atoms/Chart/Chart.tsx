import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PopulationByYear } from "../../../types/domain/chart";
import { formatPopulation, formatTooltipValue } from "../../../utils/formatters";

export interface ChartLineProps {
  dataKey: string;
  name: string;
  color: string;
}
export interface ChartProps {
  data: PopulationByYear[];
  lines: ChartLineProps[];
  xAxisLabel?: string;
  yAxisLabel?: string;
}

/**
 * Chart - グラフを描画するコンポーネント
 * @param {PopulationByYear[]} data - データ（年と数値のプロパティを持つオブジェクトの配列）
 * @param {string} xAxisLabel - X軸のラベル
 * @param {string} yAxisLabel - Y軸のラベル
 **/
export function Chart({ data, lines, xAxisLabel = "年", yAxisLabel = "人口数" }: ChartProps) {
  const height = 300;

  return (
    <ResponsiveContainer height={height} width="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          label={{ value: xAxisLabel, position: "insideBottomRight", offset: -5 }}
        />
        <YAxis
          label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }}
          tickFormatter={formatPopulation}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
          labelFormatter={(label) => `${label}年`}
        />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={index}
            activeDot={{ r: 8 }}
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
