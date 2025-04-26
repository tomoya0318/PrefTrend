import { Prefecture } from "../../types/domain/prefecture";
import { PrefectureCheckboxList } from "../organisms/PrefectureCheckboxList";

export interface DashboardTemplateProps {
  prefectures: Prefecture[];
  checkedPrefCodes: number[];
  onPrefectureChange: (prefCode: number, checked: boolean) => void;
}

export function DashboardTemplate({
  prefectures,
  checkedPrefCodes,
  onPrefectureChange,
}: DashboardTemplateProps) {
  return (
    <div className="mx-10 my-10 items-center border-2 border-primary">
      <h1 className="mb-5 border-b-2 border-primary p-5 text-2xl text-primary">title</h1>
      <main>
        <h2 className="ml-2 inline-block w-auto border-2 border-secondary p-2">都道府県</h2>
        <PrefectureCheckboxList
          checkedPrefCodes={checkedPrefCodes}
          prefectures={prefectures}
          onPrefectureChange={onPrefectureChange}
        />
      </main>
    </div>
  );
}
