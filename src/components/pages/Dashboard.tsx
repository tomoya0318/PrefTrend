import { useState } from "react";

import { useGetPrefectures } from "../../hooks/useGetPrefectures";
import { isApiError } from "../../utils/typeGuards";
import { ErrorMessage } from "../molecules/ErrorMessage";
import { Loading } from "../molecules/Loading";
import { DashboardTemplate } from "../templates/DashboardTemplate";

export function Dashboard() {
  // React Queryを使用して都道府県データを取得
  const { prefectures, isLoading, error, refetch } = useGetPrefectures();
  const [checkedPrefCodes, setCheckedPrefCodes] = useState<number[]>([]);

  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    if (checked) {
      setCheckedPrefCodes([...checkedPrefCodes, prefCode]);
    } else {
      setCheckedPrefCodes(checkedPrefCodes.filter((code) => code !== prefCode));
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // エラー時の表示
  if (error && isApiError(error)) {
    console.error("Error fetching prefectures:", error);
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorMessage error={error} onClick={() => refetch()} />
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
          onClick={() => refetch()}
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
