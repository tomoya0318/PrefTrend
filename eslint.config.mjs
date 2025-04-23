import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import pluginUnicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  // 基本設定（すべてのJavaScript/TypeScriptファイル）
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      js,
      "simple-import-sort": pluginSimpleImportSort
    },
    rules: {
      // インポートの順序設定
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // 1. Reactとサードパーティライブラリ
            ["^react", "^@?\\w"],
            // 2. TypeScriptの型定義
            ["^@/types"],
            // 3. アプリケーションの機能モジュール
            ["^@/features"],
            // 4. コンポーネント
            ["^@/components"],
            // 5. ユーティリティ、フック、サービス等
            ["^@/hooks", "^@/utils", "^@/services"],
            // 6. スタイル
            ["^@/styles"],
            // 7. アセット（画像など）
            ["^@/assets"],
            // 8. その他のローカルインポート
            ["^\\./(?!.*\\.css$).*$", "^\\.(?!/?$)"],
            // 9. スタイルシートインポート
            ["^.+\\.css$"]
          ]
        }
      ],
      "simple-import-sort/exports": "error",
    }
  },

  // TypeScriptファイル用の設定
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        projectService: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/naming-convention": [
        "error",
        // Reactコンポーネントの命名規則（PascalCase）
        {
          selector: "variable",
          types: ["function"],
          format: ["PascalCase"],
          filter: {
            regex:
              "^[A-Z][a-zA-Z0-9]*(?:Layout|Page|Component|Provider|Context|Router|Container|Wrapper|List|Item|Form|Modal|Button|Icon|View)$",
            match: true,
          },
        },
        // 通常の変数、パラメータ、メンバーの命名規則
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        // Reactフックの命名規則（useXxx）
        {
          selector: "variable",
          types: ["function"],
          format: ["camelCase"],
          filter: {
            regex: "^use[A-Z]",
            match: true,
          },
        },
        // インターフェースの命名規則（PascalCase）
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        // 型の命名規則（PascalCase）
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        // 列挙型の命名規則
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        // 列挙型メンバーの命名規則
        {
          selector: "enumMember",
          format: ["UPPER_CASE", "PascalCase"],
        },
        // 関数宣言の命名規則
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
      ],
      // TypeScriptでは不要になったルール
      "no-undef": "off",
    },
  },

  // Reactファイル用の設定
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
      "jsx-a11y": pluginJsxA11y,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["to"],
        }
      ],
      "jsx-a11y/label-has-associated-control": [
        "error",
        {
          assert: "either",
        }
      ],
    },
  },

  // ファイル名規則の設定（コンポーネント vs 非コンポーネント）
  {
    files: ["**/*.ts"],
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          case: "camelCase",
          // 正しい正規表現形式に修正
          ignore: ["vite-env\\.d\\.ts$", ".*\\.d\\.ts$"]
        },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    plugins: {
      unicorn: pluginUnicorn,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            pascalCase: true,
          },
          // 正しい正規表現形式に修正
          ignore: [
            "^main\\.tsx$",
            "^router\\.tsx$",
            "^index\\.tsx$",
            ".*\\.slice\\.tsx$",
            ".*\\.context\\.tsx$",
            ".*\\.hooks\\.tsx$"
          ],
        },
      ],
    },
  },

  // Prettierとの競合回避
  eslintConfigPrettier,

  // 除外ディレクトリ設定
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".eslintrc.cjs",
      "vite.config.ts",
    ],
  },
]);
