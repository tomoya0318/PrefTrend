import { http, HttpResponse } from "msw";

import { ApiResponse } from "../types/api";
import { PopulationCompositionPerYear } from "../types/domain/population";

// mockデータ用の都道府県コードをキーとする人口データマップ
interface PopulationDataMap {
  [prefCode: string]: PopulationCompositionPerYear;
}

export const handlers = [
  // 都道府県一覧API
  http.get("*/prefectures", () => {
    return HttpResponse.json([
      { prefCode: 1, prefName: "北海道" },
      { prefCode: 13, prefName: "東京都" },
    ]);
  }),

  // 人口構成API
  http.get(`*/population/composition/perYear`, ({ request }) => {
    const url = new URL(request.url);
    const prefCode = url.searchParams.get("prefCode");

    // prefCodeがない場合のエラーレスポンス（実際のAPIに合わせたフォーマット）
    if (!prefCode) {
      const zodError = {
        success: false,
        error: {
          issues: [
            {
              code: "invalid_type",
              expected: "string",
              received: "undefined",
              path: ["prefCode"],
              message: "Required",
            },
          ],
          name: "ZodError",
        },
      };
      return HttpResponse.json(zodError, { status: 400 });
    }

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

    if (!(prefCode in populationData)) {
      return HttpResponse.json("Not Found", { status: 404 });
    }

    const response: ApiResponse<PopulationCompositionPerYear> = {
      message: null,
      result: populationData[prefCode],
    };

    return HttpResponse.json(response);
  }),
];
