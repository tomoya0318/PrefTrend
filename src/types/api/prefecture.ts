// 都道府県の基本情報
export interface Prefecture {
  prefCode: number;
  prefName: string;
}

// 都道府県一覧APIのレスポンス
export interface PrefecturesResponse {
  message: null | string;
  result: Prefecture[];
}
