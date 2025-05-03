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
    populationData,
    isLoading: isPopulationLoading,
    hasError: populationHasError,
  } = usePrefecturePopulation(prefectures || [], "総人口");

  // 都道府県または人口データのどちらかがロード中の場合
  if (isPrefLoading || (checkedPrefCodes.length > 0 && isPopulationLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // 都道府県データ取得のエラー時の表示
  if (prefError && isApiError(prefError)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage error={prefError} onClick={() => prefRefech()} />
      </div>
    );
  }

  // 人口データ取得のエラー時の表示（都道府県が選択されている場合のみ）
  if (checkedPrefCodes.length > 0 && populationHasError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage
          message="人口データの取得中にエラーが発生しました"
          onClick={() => window.location.reload()}
        />
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
      populationData={populationData}
      prefectures={prefectures}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}
