import { http, HttpResponse } from "msw";

import { defaultConfig } from "../api/fetcher";
import { PopulationData } from "../types/domain/population";

// mockデータ用の都道府県コードをキーとする人口データマップ
interface PopulationDataMap {
  [prefCode: string]: PopulationData;
}

// 環境設定からAPIのベースURLを取得
const API_BASE_URL = defaultConfig.baseURL;

export const handlers = [
  // 都道府県一覧API - 完全なURLパターン
  http.get(`${API_BASE_URL}/prefectures`, () => {
    return HttpResponse.json([
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 13, prefName: "東京都" },
    ]);
  }),

  // 都道府県一覧API - 相対パスパターン（テスト用）
  http.get("/prefectures", () => {
    return HttpResponse.json([
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 13, prefName: "東京都" },
    ]);
  }),

  // 人口構成API
  http.get(`${API_BASE_URL}/population/composition/perYear`, ({ request }) => {
    const url = new URL(request.url);
    const prefCode = url.searchParams.get("prefCode");

    // mockデータ
    const populationData: PopulationDataMap = {
      "1": {
        // 北海道 - すべてのラベルを含む
        boundaryYear: 2020,
        data: [
          {
            label: "総人口",
            data: [
              { year: 1980, value: 5575989 },
              { year: 2020, value: 5224614 },
            ],
          },
          {
            label: "年少人口",
            data: [
              { year: 1980, value: 1298324 },
              { year: 2020, value: 555804 },
            ],
          },
          {
            label: "生産年齢人口",
            data: [
              { year: 1980, value: 3823808 },
              { year: 2020, value: 2945727 },
            ],
          },
          {
            label: "老年人口",
            data: [
              { year: 1980, value: 451727 },
              { year: 2020, value: 1664023 },
            ],
          },
        ],
      },
      "13": {
        // 東京都 - 総人口のみ（最小限のデータ）
        boundaryYear: 2020,
        data: [
          {
            label: "総人口",
            data: [
              { year: 1980, value: 11618281 },
              { year: 2020, value: 14047594 },
            ],
          },
        ],
      },
    };

    // prefCodeが存在しても、対応するデータがない場合のデフォルトデータ
    const defaultData = {
      boundaryYear: 2020,
      data: [{ label: "総人口", data: [{ year: 2020, value: 0 }] }],
    };

    return HttpResponse.json({
      message: null,
      result: prefCode && prefCode in populationData ? populationData[prefCode] : defaultData,
    });
  }),
];
