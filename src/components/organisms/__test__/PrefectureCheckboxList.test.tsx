// filepath: /Users/tomoya-n/dev/PrefTrend/src/components/organisms/__test__/PrefectureCheckboxList.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Prefecture } from "../../../types/api/prefecture";
import { PrefectureCheckboxList } from "../PrefectureCheckboxList";

import "@testing-library/jest-dom";

describe("PrefectureCheckboxList component", () => {
  const mockPrefectures: Prefecture[] = [
    { prefCode: 1, prefName: "北海道" },
    { prefCode: 2, prefName: "青森県" },
    { prefCode: 13, prefName: "東京都" },
    { prefCode: 27, prefName: "大阪府" },
  ];

  const defaultProps = {
    prefectures: mockPrefectures,
    checkedPrefCodes: [],
    onPrefectureChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("都道府県リストが正しくレンダリングされる", () => {
    render(<PrefectureCheckboxList {...defaultProps} />);

    // すべての都道府県名が表示されていることを確認
    mockPrefectures.forEach((pref) => {
      expect(screen.getByText(pref.prefName)).toBeInTheDocument();
    });

    // すべてのチェックボックスが存在することを確認
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(mockPrefectures.length);

    // チェックボックスがすべて未選択であることを確認
    checkboxes.forEach((checkbox) => {
      expect(checkbox).not.toBeChecked();
    });
  });

  test("チェックされた都道府県のチェックボックスが選択された状態でレンダリングされる", () => {
    const checkedPrefCodes = [1, 13]; // 北海道と東京都をチェック

    render(<PrefectureCheckboxList {...defaultProps} checkedPrefCodes={checkedPrefCodes} />);

    // チェックされるべきチェックボックスがチェックされていることを確認
    mockPrefectures.forEach((pref) => {
      const checkbox = screen.getByRole("checkbox", { name: new RegExp(`${pref.prefName}を選択`) });
      if (checkedPrefCodes.includes(pref.prefCode)) {
        expect(checkbox).toBeChecked();
      } else {
        expect(checkbox).not.toBeChecked();
      }
    });
  });

  test("チェックボックスをクリックすると正しい引数でonPrefectureChangeが呼ばれる", async () => {
    const onPrefectureChange = jest.fn();
    const user = userEvent.setup();

    render(
      <PrefectureCheckboxList
        checkedPrefCodes={[]}
        prefectures={mockPrefectures}
        onPrefectureChange={onPrefectureChange}
      />,
    );

    // 東京都のチェックボックスを見つけてクリック
    const tokyoCheckbox = screen.getByRole("checkbox", { name: "東京都を選択" });
    await user.click(tokyoCheckbox);

    // 正しい引数でonPrefectureChangeが呼ばれることを確認
    expect(onPrefectureChange).toHaveBeenCalledWith(13, true);
    expect(onPrefectureChange).toHaveBeenCalledTimes(1);
  });

  test("チェック済みのチェックボックスをクリックすると、チェックが外れる", async () => {
    const onPrefectureChange = jest.fn();
    const user = userEvent.setup();

    render(
      <PrefectureCheckboxList
        checkedPrefCodes={[1]} // 北海道はチェック済み
        prefectures={mockPrefectures}
        onPrefectureChange={onPrefectureChange}
      />,
    );

    // 北海道のチェックボックスを見つけてクリック
    const hokkaidoCheckbox = screen.getByRole("checkbox", { name: "北海道を選択" });
    expect(hokkaidoCheckbox).toBeChecked();
    await user.click(hokkaidoCheckbox);

    // 正しい引数でonPrefectureChangeが呼ばれることを確認
    expect(onPrefectureChange).toHaveBeenCalledWith(1, false);
    expect(onPrefectureChange).toHaveBeenCalledTimes(1);
  });

  test("空の都道府県リストでも正しく表示される", () => {
    render(
      <PrefectureCheckboxList
        checkedPrefCodes={[]}
        prefectures={[]}
        onPrefectureChange={defaultProps.onPrefectureChange}
      />,
    );

    // チェックボックスが存在しないことを確認
    const checkboxes = screen.queryAllByRole("checkbox");
    expect(checkboxes).toHaveLength(0);
  });

  test("グリッドレイアウトが適用されている", () => {
    const { container } = render(<PrefectureCheckboxList {...defaultProps} />);

    // gridクラスが適用されているかを確認
    const gridDiv = container.querySelector("div");
    expect(gridDiv).toHaveClass("grid");
    expect(gridDiv).toHaveClass("grid-cols-2");
    expect(gridDiv).toHaveClass("md:grid-cols-3");
    expect(gridDiv).toHaveClass("lg:grid-cols-4");
    expect(gridDiv).toHaveClass("gap-2");
  });
});
