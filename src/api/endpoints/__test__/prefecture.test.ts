import { fetcher } from "../../fetcher";
import { getPrefectures } from "../prefecture";

// モック設定
jest.mock("../../fetcher", () => ({
  fetcher: {
    get: jest.fn(),
  },
}));

describe("Prefecture API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPrefectures", () => {
    it("都道府県一覧を正常に取得できること", async () => {
      // モックデータ
      const mockPrefectures = [
        { id: 1, name: "北海道" },
        { id: 2, name: "青森県" },
        { id: 3, name: "岩手県" },
      ];

      // モックの実装
      (fetcher.get as jest.Mock).mockResolvedValue({
        data: mockPrefectures,
      });

      // API呼び出し
      const result = await getPrefectures();

      // 検証
      expect(fetcher.get).toHaveBeenCalledWith("/prefectures");
      expect(result).toEqual(mockPrefectures);
      expect(result.length).toBe(3);
    });

    it("API呼び出しが失敗した場合にエラーをスローすること", async () => {
      // エラーのモック
      const mockError = new Error("API呼び出しに失敗しました");
      (fetcher.get as jest.Mock).mockRejectedValue(mockError);

      // APIを呼び出し、エラーがスローされることを確認
      await expect(getPrefectures()).rejects.toThrow("API呼び出しに失敗しました");
      expect(fetcher.get).toHaveBeenCalledWith("/prefectures");
    });
  });
});
