# AI Asset Lab - Handoff

新しいチャットでは

以下の順番でドキュメントを読んでください。

1 README.md

2 PRODUCT_VISION.md

3 PRODUCT_PRINCIPLES.md

4 ROADMAP.md

5 AI_CONTEXT.md

6 AI_PM.md

7 ARCHITECTURE.md

8 PROJECT_PROGRESS.md

9 CHANGELOG.md

10 DECISIONS.md

---

その後

PM兼テックリードとして

開発を継続してください。

---

開発ルール

・完成版コード

・Sprint形式

・Commit

・Push

まで提示してください。

---

MVP完成までは

設計変更禁止です。

---

AI Chat運用メモ

・OpenAI APIを利用するには `OPENAI_API_KEY` が必要です。

・実行環境から `https://api.openai.com` への外部HTTPS通信が許可されている必要があります。

・APIキー未設定時、またはOpenAI接続失敗時は簡易回答にfallbackします。

・本番ログにはAPIキーやOpenAI response bodyを出力しないでください。

・Chat APIはAPIキー設定前の安全対策として、message 1,000文字制限、history最大6件、portfolio最大8件、出力token上限、15秒timeout、best-effort rate limitを持ちます。

・rate limitはin-memoryのbest-effortです。Vercel Serverlessの複数インスタンス間では完全共有されないため、OpenAI側Budget / Usage Limit / Usage Alertと併用してください。

・OpenAI APIをProductionで有効化する前に、Billing、低い月額Budget、Usage Alert、Production API key、Vercel Production環境変数、Production再デプロイ、Smoke Testを確認してください。

・2026-07-27時点でOpenAI Billingは有効、初回クレジット5 USD、Auto recharge OFF、Production API key設定済み、`OPENAI_MODEL=gpt-4o-mini`、本番AI応答確認済みです。キー値は記録しません。

・Step7-BではAI相談のprompt品質を改善しました。Productionデプロイは未実行のため、反映後に新NISA、資産未登録、危険相談、個別銘柄、機密情報のSmoke Testを実施してください。

・Step7-CではAI相談へPortfolio Summaryではなく `PortfolioInsights` を渡すようにしました。Insightsは総資産、カテゴリ比率、集中度、分散状態、warnings / strengths / recommendationsを持ちます。

・AIにはInsightsを質問と関係ある場合のみ自然に使わせ、数値一覧を読み上げさせない方針です。資産未登録時は「資産情報未登録」のみ渡します。

・Step7-C Production Smoke TestはNo-Goでした。原因はChatClientが実際のPortfolio保存キー `aiassetlab_portfolio_assets_v1` を読んでいなかったことです。Step7-C.1で `loadPortfolioAssets()` 経由に修正し、送信直前に最新contextを再取得するようにしました。

・Portfolio context deliveryは `npm run test:portfolio-context` で確認できます。OpenAI APIは呼ばず、最終promptとOpenAI messagesにInsightsが含まれることを検証します。

---

環境変数

| Name | Purpose | Required |
|------|---------|----------|
| `OPENAI_API_KEY` | AI ChatでOpenAI APIを利用するためのサーバー側APIキー | 任意 |
| `OPENAI_MODEL` | AI Chatで利用するOpenAIモデル名。未設定時は `gpt-4o-mini` | 任意 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 のMeasurement ID。未設定時はGA無効 | 任意 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity のProject ID。未設定時はClarity無効 | 任意 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console のHTMLタグverification値 | 任意 |

公開環境では、OpenAI API利用時に外部HTTPS通信が許可されていることも確認してください。
