import { PopulationByYear } from "@/types/domain/chart";
import { Prefecture } from "@/types/domain/prefecture";
import { ApiError } from "@/types/errors";

import { MultiLineChart } from "@/components/molecules/MultiLineChart/MultiLineChart";
import { PrefectureCheckboxList } from "@/components/organisms/PrefectureCheckboxList";

import { LabeledSelect } from "../molecules/LabeledSelect";
import { PopulationType } from "../pages/Dashboard";

export interface DashboardTemplateProps {
  prefectures?: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
  isPrefLoading: boolean;
  isPrefError: ApiError | null;
  isPrefRefetch: () => void;
  populationData: PopulationByYear[];
  selectedPopulationType: PopulationType;
  populationTypeOptions: {
    value: PopulationType;
    label: string;
  }[];
  onPopulationTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function DashboardTemplate({
  prefectures,
  checkedPrefCodes,
  onPrefectureChange,
  isPrefLoading,
  isPrefError,
  isPrefRefetch,
  populationData,
  selectedPopulationType,
  populationTypeOptions,
  onPopulationTypeChange,
}: DashboardTemplateProps) {
  return (
    <div aria-label="ダッシュボード" className="mx-10 my-10 items-center border-2 border-primary">
      <h1
        aria-label="ダッシュボードタイトル"
        className="mb-5 border-b-2 border-primary p-5 text-2xl text-primary"
      >
        都道府県別人口推移
      </h1>
      <main className="pl-6">
        <h2
          aria-label="都道府県セクション"
          className="mb-3 ml-2 inline-block w-auto border-2 border-secondary p-2"
        >
          都道府県
        </h2>
        <PrefectureCheckboxList
          checkedPrefCodes={checkedPrefCodes}
          error={isPrefError}
          isLoading={isPrefLoading}
          prefectures={prefectures}
          refetch={isPrefRefetch}
          onPrefectureChange={onPrefectureChange}
        />
        <div className="my-5 ml-2">
          <LabeledSelect
            className="mb-4"
            id="populationType"
            label="人口種別"
            options={populationTypeOptions}
            value={selectedPopulationType}
            onChange={onPopulationTypeChange}
          />
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
