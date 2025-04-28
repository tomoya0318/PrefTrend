import { useState } from "react";

import { useGetPrefectures } from "../../hooks/useGetPrefectures";
import { DashboardTemplate } from "../templates/DashboardTemplate";

export function Dashboard() {
  // React Queryを使用して都道府県データを取得
  const { prefectures, isLoading, error } = useGetPrefectures();
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
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-lg">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="mb-2 text-xl font-bold">エラーが発生しました</h2>
          <p>{error instanceof Error ? error.message : "データの取得に失敗しました"}</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  // データがない場合の表示
  if (!prefectures || prefectures.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">都道府県データが見つかりませんでした</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
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
