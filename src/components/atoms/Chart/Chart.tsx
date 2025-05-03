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
export function Chart({ data, lines, xAxisLabel = "年", yAxisLabel = "人口数(万人)" }: ChartProps) {
  const height = 300;
  return (
    <div className="chart-container text-base sm:text-sm md:text-base lg:text-lg">
      <ResponsiveContainer height={height} width="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            angle={0} // 角度を0に設定（水平表示）
            dataKey="year"
            label={{
              value: xAxisLabel,
              position: "insideBottomCenter",
              offset: 40, // ラベルをさらに下に移動
              dy: 25,
            }}
            minTickGap={15} // tick間の最小間隔を設定（表示数を減らす）
            padding={{ left: 30, right: 30 }} // 左右の余白を追加
            tick={{ dy: 5 }} // tick（数値ラベル）の配置調整
          />
          <YAxis
            allowDataOverflow={false} // データオーバーフローを許可しない
            domain={[0, "auto"]} // Y軸の下限を0に固定、上限は自動調整
            dx={-5} // Y軸の数字を左に移動
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              dx: -20, // Y軸ラベルを左に移動
            }}
            tickFormatter={formatPopulation}
          />
          <Tooltip
            formatter={(value: number, name: string) => [formatTooltipValue(value), name]}
            labelFormatter={(label) => `${label}年`}
          />
          <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 20 }} />
          {lines.map((line, index) => (
            <Line
              key={index}
              activeDot={{ r: 6 }}
              dataKey={line.dataKey}
              dot={{ strokeWidth: 1, r: 4 }} // ドットのサイズを調整
              name={line.name}
              stroke={line.color}
              strokeWidth={2} // 線の太さを調整
              type="monotone"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
