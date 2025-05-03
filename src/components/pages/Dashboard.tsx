import { useGetPrefectures } from "../../hooks/useGetPrefectures";
import { usePrefecturePopulation } from "../../hooks/usePrefecturePopulation";
import { isApiError } from "../../utils/typeGuards";
import { ErrorMessage } from "../molecules/ErrorMessage";
import { Loading } from "../molecules/Loading";
import { DashboardTemplate } from "../templates/DashboardTemplate";

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
    populationCompositions,
    isLoading: isPopulationLoading,
    hasError: populationHasError,
  } = usePrefecturePopulation();

  // ローディング中の表示
  if (isPrefLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // エラー時の表示
  if (prefError && isApiError(prefError)) {
    console.error("Error fetching prefectures:", prefError);
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage error={prefError} onClick={() => prefRefech()} />
      </div>
    );
  }

  // データがない場合の表示
  if (!prefectures || prefectures.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage
          message="都道府県データが見つかりませんでした"
          title="データが見つかりません"
          onClick={() => prefRefech()}
        />
      </div>
    );
  }

  // データがロードできた場合、テンプレートを表示
  return (
    <DashboardTemplate
      checkedPrefCodes={checkedPrefCodes}
      prefectures={prefectures}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}
