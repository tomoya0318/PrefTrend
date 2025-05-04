import { PopulationByYear } from "@/types/domain/chart";
import { Prefecture } from "@/types/domain/prefecture";
import { ApiError } from "@/types/errors";

import { PrefectureCheckboxList } from "@/components/organisms/PrefectureCheckboxList";

import { LabeledSelect } from "../molecules/LabeledSelect";
import PopulationChart from "../organisms/PopulationChart";
import { PopulationType } from "../pages/Dashboard";

export interface DashboardTemplateProps {
  prefectures?: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
  isPrefLoading: boolean;
  isPrefError: ApiError | null;
  isPrefRefetch: () => void;
  populationData: PopulationByYear[];
  isPopulationLoading: boolean;
  populationHasError: boolean;
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
  isPopulationLoading,
  populationHasError,
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
            <PopulationChart
              data={populationData}
              error={populationHasError}
              isLoading={isPopulationLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
