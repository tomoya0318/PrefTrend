#!/bin/bash

# Cloudflareにデプロイするためのスクリプト
# 現在の日付を自動的に使用してwranglerでデプロイします

# 現在の日付をYYYY-MM-DD形式で取得
CURRENT_DATE=$(date +%Y-%m-%d)

# デプロイ先の名前
PROJECT_NAME="preftrend"

# ビルドディレクトリ
ASSETS_DIR="./dist"

# コマンドを構築
DEPLOY_COMMAND="npx wrangler deploy --assets=${ASSETS_DIR} --compatibility-date ${CURRENT_DATE} --name ${PROJECT_NAME}"

echo "🚀 Deploying to Cloudflare with command:"
echo "${DEPLOY_COMMAND}"

# コマンドを実行
if ${DEPLOY_COMMAND}; then
  echo "Deployment completed successfully!"
  exit 0
else
  echo "Deployment failed!"
  exit 1
fi
