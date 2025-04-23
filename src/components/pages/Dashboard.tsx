import { useState } from "react";

import { Prefecture } from "../../types/api/prefecture";
import { DashboardTemplate } from "../templates/DashboardTemplate";

const mockPrefectures: Prefecture[] = [
  { prefCode: 1, prefName: "北海道" },
  { prefCode: 2, prefName: "青森県" },
  { prefCode: 3, prefName: "岩手県" },
  { prefCode: 4, prefName: "宮城県" },
  { prefCode: 5, prefName: "秋田県" },
  { prefCode: 6, prefName: "山形県" },
  { prefCode: 7, prefName: "福島県" },
  { prefCode: 8, prefName: "茨城県" },
  { prefCode: 9, prefName: "栃木県" },
  { prefCode: 10, prefName: "群馬県" },
];

export function Dashboard() {
  // todo: 後でfetchしてくる
  const prefectures: Prefecture[] = mockPrefectures;
  const [checkedPrefCodes, setCheckedPrefCodes] = useState<number[]>([]);

  const handlePrefectureChange = (prefCode: number, checked: boolean) => {
    if (checked) {
      setCheckedPrefCodes([...checkedPrefCodes, prefCode]);
    } else {
      setCheckedPrefCodes(checkedPrefCodes.filter((code) => code !== prefCode));
    }
  };
  return (
    <DashboardTemplate
      checkedPrefCodes={checkedPrefCodes}
      prefectures={prefectures}
      onPrefectureChange={handlePrefectureChange}
    />
  );
}
