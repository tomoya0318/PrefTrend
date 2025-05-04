# PrefTrend - 都道府県別人口推移可視化アプリ

## 使用技術一覧
<p style="display: inline">
  <!-- フロントエンドのフレームワーク一覧 -->
  <img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Vite-646CFF.svg?logo=vite&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Tailwind_CSS-06B6D4.svg?logo=tailwindcss&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-React_Query-FF4154.svg?logo=reactquery&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Recharts-22B5BF.svg?style=for-the-badge&logoColor=white">
</p>

## 目次
1. [開発にあたって](#開発にあたって)
1. [環境](#環境)
2. [開発環境構築](#開発環境構築)

## 開発にあたって
[http://localhost:5173](http://localhost:5173)で開発用のページにアクセスできます。

## 環境
| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| Node.js               | 22.14.0    |
| React                 | 19.0.0     |
| TypeScript            | 5.7.2      |
| Vite                  | 6.3.1      |
| Tailwind CSS          | 4.1.4      |
| recharts              | 2.15.3     |

その他のパッケージのバージョンは package.json を参照してください

## 開発環境構築
nodeを[環境](#環境)に指定したバージョンで作業を行なってください

1. パッケージのインストール
```
npm install
```

2. localhostの立ち上げ
```
npm run dev
```

3. テストの実行
```
npm test
```

## アプリケーション構成

このプロジェクトは以下のような構成になっています：

- **src/components**: UIコンポーネント
  - **atoms**: 最小単位のコンポーネント（Button, Chart, Checkbox, Spinnerなど）
  - **molecules**: 複数のatomsで構成される中規模コンポーネント（ErrorMessage, Loading, MultiLineChartなど）
  - **organisms**: ビジネスロジックを含む大規模コンポーネント
  - **templates**: ページレイアウトを担当するコンポーネント
  - **pages**: ルーティングされるページコンポーネント

- **src/hooks**: カスタムReactフック
- **src/api**: APIクライアント
- **src/types**: 型定義
- **src/utils**: ユーティリティ関数
- **src/__tests__**: テストファイル

## コマンド一覧

| コマンド         | 説明                                   |
| ---------------- | -------------------------------------- |
| `npm run dev`    | 開発サーバーを起動                     |
| `npm run build`  | プロダクションビルドを生成             |
| `npm run lint`   | ESLintとPrettierによるコード整形       |
| `npm run format` | Prettierによるコード整形               |
| `npm test`       | テストを実行                           |
| `npm run deploy` | デプロイスクリプトの実行               |
