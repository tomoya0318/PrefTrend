import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./mocks/server";

import "@testing-library/jest-dom";

// テスト開始前にMSWサーバーを起動
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// 各テスト後にハンドラーをリセット
afterEach(() => server.resetHandlers());

// テスト終了後にサーバーをクリーンアップ
afterAll(() => server.close());
