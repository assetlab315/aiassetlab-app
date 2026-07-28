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
Productionで正式なAI回答を有効化する前に、OpenAI Billing、低い月額Budget、Usage Alert、APIキー管理、Production再デプロイ手順を確認してください。APIキー値はGit、ドキュメント、ログへ記録しません。

---

## Public Client Side

| Name | Purpose | Required |
|------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | metadataBase、canonical、sitemap、robots、外部サイトリンクに利用する公開URL | 推奨 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 のMeasurement ID。設定時のみGA4計測コードを読み込みます | 任意 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity のProject ID。設定時のみClarity計測コードを読み込みます | 任意 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console のHTMLタグverification値。別方式で所有権確認する場合に利用します | 任意 |
| `NEXT_PUBLIC_SUPABASE_URL` | 診断結果保存、Supabase Auth、Portfolio Cloud Syncで利用するSupabase Project URL | 必須 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 診断結果保存、Supabase Auth、Portfolio Cloud Syncで利用するSupabase anon key。RLS前提の公開key | 必須 |

---

## Notes

- `NEXT_PUBLIC_` で始まる値はブラウザへ公開されます。
- 秘密情報は `NEXT_PUBLIC_` 付きの環境変数に入れないでください。
- Supabaseのservice role keyなどの秘密情報は `NEXT_PUBLIC_SUPABASE_ANON_KEY` に入れないでください。
- Step10-A1では `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` 方式に統一し、Publishable Key方式との混在はしません。
- Supabaseのservice role keyは今回使用しません。Client Component、browser bundle、Vercel public envへ設定しないでください。
- Supabase環境変数を変更した場合、対象Environmentの再デプロイが必要です。
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` は公開環境変数であり秘密鍵ではありませんが、計測混入を避けるためProduction環境だけに設定します。
- Productionでは `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BB1DMLMD15` を設定済みです。Preview / Developmentには設定していません。
- `NEXT_PUBLIC_CLARITY_ID` は未設定で、Clarity計測は開始していません。
- GA4 / Clarityは未設定時に自動で無効になります。
- GA4 / Clarityは公開環境変数が設定され、かつ `VERCEL_ENV=production` の場合のみ読み込むコードガードがあります。
- 環境変数変更後はProduction再デプロイが必要です。
- Clarityを導入する場合は、資産情報やAI相談内容のマスキング方針を確認してから `NEXT_PUBLIC_CLARITY_ID` を設定します。
- Search ConsoleはURLプレフィックスプロパティ `https://aiassetlab.jp/` で確認済みです。`https://aiassetlab.jp/sitemap.xml` は送信済みで、サイトマップ登録は成功済みです。
- CookieバナーはVersion1.1では追加していません。
- `NEXT_PUBLIC_SITE_URL` が未設定の場合は `https://aiassetlab.jp` を利用します。
- Productionでは `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` を明示設定し、非wwwをPrimary Domainにする方針です。
- PreviewとProductionで `NEXT_PUBLIC_SITE_URL` が意図したURLになっているか、canonical、robots、sitemapの出力で確認してください。
- Productionでは `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` の3項目を設定済みです。
- Production Smoke Testでは canonical、OGP、robots、sitemap が `https://aiassetlab.jp` を参照することを確認済みです。
- Chat APIはAPIキー設定前の安全対策として、message 1,000文字制限、history最大6件、portfolio最大8件、OpenAI出力上限、15秒timeout、best-effort rate limitを持ちます。
- Chat APIのrate limitはin-memoryのbest-effortです。Vercel Serverlessの複数インスタンス間では完全共有されないため、OpenAI側Budget / Usage Limitと併用してください。
