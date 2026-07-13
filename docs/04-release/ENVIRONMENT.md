# AI Asset Lab - Environment

公開環境で利用する環境変数の一覧です。値はこのドキュメントには記載しません。

---

## Server Side

| Name | Purpose | Required |
|------|---------|----------|
| `OPENAI_API_KEY` | AI ChatでOpenAI APIを利用するためのAPIキー | 任意 |
| `OPENAI_MODEL` | AI Chatで利用するOpenAIモデル名。未設定時は `gpt-4o-mini` | 任意 |

`OPENAI_API_KEY` が未設定の場合、AI Chatは簡易回答にfallbackします。設定する場合は、実行環境から `https://api.openai.com` への外部HTTPS通信が許可されていることも確認してください。
初回Production公開では `OPENAI_API_KEY` をまだ設定せず、fallbackを正常仕様として扱います。

---

## Public Client Side

| Name | Purpose | Required |
|------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | metadataBase、canonical、sitemap、robots、外部サイトリンクに利用する公開URL | 推奨 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 のMeasurement ID。設定時のみGA4計測コードを読み込みます | 任意 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity のProject ID。設定時のみClarity計測コードを読み込みます | 任意 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console のHTMLタグverification値。metadataで所有権確認に利用します | 任意 |
| `NEXT_PUBLIC_SUPABASE_URL` | 診断結果保存で利用するSupabase Project URL | 必須 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 診断結果保存で利用するSupabase anon key | 必須 |

---

## Notes

- `NEXT_PUBLIC_` で始まる値はブラウザへ公開されます。
- 秘密情報は `NEXT_PUBLIC_` 付きの環境変数に入れないでください。
- Supabaseのservice role keyなどの秘密情報は `NEXT_PUBLIC_SUPABASE_ANON_KEY` に入れないでください。
- 初回Production公開ではGA4 / Clarityを未設定にし、Production安定確認後に導入を判断します。
- GA4 / Clarityは未設定時に自動で無効になります。
- CookieバナーはVersion1.1では追加していません。
- `NEXT_PUBLIC_SITE_URL` が未設定の場合は `https://aiassetlab.jp` を利用します。
- Productionでは `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` を明示設定し、非wwwをPrimary Domainにする方針です。
- PreviewとProductionで `NEXT_PUBLIC_SITE_URL` が意図したURLになっているか、canonical、robots、sitemapの出力で確認してください。
- Productionでは `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` の3項目を設定済みです。
- Production Smoke Testでは canonical、OGP、robots、sitemap が `https://aiassetlab.jp` を参照することを確認済みです。
