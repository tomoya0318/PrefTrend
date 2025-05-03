import { PopulationByYear } from "@/types/domain/chart";
import { Prefecture } from "@/types/domain/prefecture";

import { MultiLineChart } from "@/components/molecules/MultiLineChart/MultiLineChart";
import { PrefectureCheckboxList } from "@/components/organisms/PrefectureCheckboxList";

export interface DashboardTemplateProps {
  prefectures: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
  populationData: PopulationByYear[];
}

export function DashboardTemplate({
  prefectures,
  checkedPrefCodes,
  onPrefectureChange,
  populationData,
}: DashboardTemplateProps) {
  return (
    <div aria-label="ダッシュボード" className="mx-10 my-10 items-center border-2 border-primary">
      <h1
        aria-label="ダッシュボードタイトル"
        className="mb-5 border-b-2 border-primary p-5 text-2xl text-primary"
      >
        都道府県別人口推移
      </h1>
      <main>
        <h2
          aria-label="都道府県セクション"
          className="mb-3 ml-2 inline-block w-auto border-2 border-secondary p-2"
        >
          都道府県
        </h2>
        <PrefectureCheckboxList
          checkedPrefCodes={checkedPrefCodes}
          prefectures={prefectures}
          onPrefectureChange={onPrefectureChange}
        />
        <div className="mb-8">
          <h2
            aria-label="人口推移チャートセクション"
            className="mt-4 ml-2 inline-block w-auto border-2 border-secondary p-2"
          >
            人口推移
          </h2>
          <div className="mt-4 rounded-lg border border-gray-200 p-4">
            {populationData.length > 0 ? (
              <MultiLineChart data={populationData} />
            ) : (
              <p className="py-8 text-center text-lg text-secondary">
                都道府県を選択すると人口推移グラフが表示されます
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
