import { PopulationByYear } from "@/types/domain/chart";

import { ErrorMessage } from "../molecules/ErrorMessage";
import { Loading } from "../molecules/Loading";
import { MultiLineChart } from "../molecules/MultiLineChart";

interface PopulationChartProps {
  data: PopulationByYear[];
  isLoading: boolean;
  error: boolean;
}
export default function PopulationChart({ data, isLoading, error }: PopulationChartProps) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorMessage
          message="人口構成データの取得中にエラーが発生しました"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <p className="py-8 text-center text-lg text-secondary">
        都道府県を選択すると人口推移グラフが表示されます
      </p>
    );
  }
  return (
    <div className="h-full w-full">
      <MultiLineChart data={data} />
    </div>
  );
}
