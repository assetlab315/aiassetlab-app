# AI Asset Lab - Production Runbook

Production公開前後に確認する運用手順です。秘密情報や実際のキー値は記載しません。

---

## Production Environment Variables

### Required

| Name | Scope | Reference | Production behavior |
|------|-------|-----------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client public | `lib/supabase.ts` | Diagnosis結果の保存・取得に必要 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client public | `lib/supabase.ts` | Diagnosis結果の保存・取得に必要 |

`NEXT_PUBLIC_` で始まる値はブラウザへ公開されます。Supabase anon keyは公開前提のキーですが、service role keyなどの秘密情報は絶対に入れないでください。

### Set for Production

| Name | Scope | Reference | Production behavior |
|------|-------|-----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | Client public / build metadata | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` | `https://aiassetlab.jp` を設定し、canonical、OGP、robots、sitemap、ヘッダーの外部リンクを本番URLへ揃える |

Productionの正規URLは `https://aiassetlab.jp` を推奨します。`www.aiassetlab.jp` を追加する場合は、Vercelで非wwwの `https://aiassetlab.jp` をPrimary Domainにし、www側は非wwwへリダイレクトする方針にします。

### Optional

| Name | Scope | Reference | Production behavior when unset |
|------|-------|-----------|--------------------------------|
| `OPENAI_API_KEY` | Server only | `app/api/chat/route.ts` | Chat APIはfallback回答を200で返す |
| `OPENAI_MODEL` | Server only | `app/api/chat/route.ts` | `gpt-4o-mini` を利用する |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client public | `app/layout.tsx` | GA4 scriptを読み込まない |
| `NEXT_PUBLIC_CLARITY_ID` | Client public | `app/layout.tsx` | Microsoft Clarity scriptを読み込まない |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Client public metadata | `app/layout.tsx` | Google verification metadataを出力しない |

PreviewとProductionでは、少なくとも `NEXT_PUBLIC_SITE_URL` を環境ごとに分けて確認します。Productionでは `https://aiassetlab.jp` を使用します。

`.env.local` と `.env` は `.gitignore` でGit管理対象外です。値をドキュメント、ログ、コミットへ記載しないでください。

---

## Domain Setup in Vercel

1. Vercel ProjectのDomains画面を開く。
2. `aiassetlab.jp` を追加する。
3. 必要に応じて `www.aiassetlab.jp` も追加する。
4. Vercel画面に表示されたDNS設定を、利用中のDNS管理サービスへ設定する。DNS値はVercel画面の表示に従い、固定値として記録しない。
5. `https://aiassetlab.jp` をPrimary Domainに設定する。
6. `www.aiassetlab.jp` を追加した場合は、非www側へリダイレクトされることを確認する。
7. SSL証明書が発行済みになっていることを確認する。
8. Production Deploymentが独自ドメインに紐付いていることを確認する。
9. Preview ProtectionがProductionへの通常アクセスを意図せず妨げていないことを確認する。

---

## Contact Address Check

公開前に `contact@aiassetlab.jp` を確認します。

- メールアドレスが実在する
- 外部アドレスから受信できる
- 迷惑メールへ振り分けられない
- Footerの `mailto:contact@aiassetlab.jp` が正しい
- Privacy Policy / Termsの連絡先と一致している
- 返信元として利用できる

コード上の参照箇所は `components/layout/AppFooter.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` です。

---

## OpenAI API Policy

初回Production公開では `OPENAI_API_KEY` を設定しません。Chat fallbackを正常仕様として公開可能とします。

コード上の確認事項:

- `OPENAI_API_KEY` 未設定時はOpenAIへfetchせず、fallback回答を200で返す
- fallback時も `source: "fallback"` を返す
- Chat UIはfallback時に「現在は簡易回答です。」を表示する
- catch時のログは最小限のerror messageのみで、APIキーやOpenAI response bodyを出さない

正式なAI回答を有効化する前の残タスク:

- OpenAI API利用枠の確認
- Billing設定
- 利用上限設定
- `OPENAI_MODEL` の最終判断
- エラー監視
- APIコスト監視
- OpenAI障害時もfallbackが継続することの確認

---

## Analytics and Verification Policy

- GA4は既存プロパティ「AI Asset Lab」と既存Web Streamを利用します。
- GA4 Web Stream URLは `https://aiassetlab.jp`、Stream IDは `15218177688`、Measurement IDは `G-BB1DMLMD15` です。
- GA4 Enhanced Measurementとページビュー計測は有効です。
- Vercel Production環境だけに `NEXT_PUBLIC_GA_MEASUREMENT_ID` を設定します。Preview / Developmentには設定しません。
- GA4はコード側でもProduction環境のみ読み込むガードを持ちます。
- GA4 Measurement ID設定後はProduction再デプロイを行います。
- Production再デプロイ後、Realtimeで初回ページ `AI資産形成診断の入口` のpage_viewを確認済みです。
- App Routerのクライアント遷移後、`資産形成Dashboard` が別のpage_viewとして1回計測されることを確認済みです。
- 今回の確認範囲では二重 `page_view` は発生していません。
- 計測漏れまたは二重計測が確認された場合のみ、専用Client Componentで明示的な `page_view` 送信を検討します。その場合は自動計測との二重計測を避けます。
- 将来的なGA4カスタムイベント候補は、診断開始、診断完了、資産登録、Dashboard表示、AI相談開始、シミュレーター利用です。
- Microsoft ClarityはGA4とは分離し、後続Sprintで導入判断します。Privacy Policy更新、機微情報のマスキング確認、本番導入前の限定的確認、ConsentおよびCookie運用の再確認を先に行います。
- Clarity導入時は、AI相談内容や資産情報を無条件に録画しない方針です。
- Google Search Console URLプレフィックスプロパティ `https://aiassetlab.jp/` は利用可能です。
- `https://aiassetlab.jp/sitemap.xml` は送信済みです。初回は「取得できませんでした」と表示されましたが、コードやDNSを変更せず待機し、その後「成功しました」へ変更されました。サイトマップ登録は完了扱いです。
- ドメインプロパティ追加は現段階では必須ではありません。
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` は、将来HTMLタグ方式など別方式を利用する場合の任意設定です。
- Version1.1ではCookieバナーを実装していません。計測サービスを有効化する前に、公開地域、利用目的、Privacy Policyの記載、運用判断を確認してください。

### Clarity Masking Policy

Clarityは導入前にマスキング方針を確認します。まずClarity管理画面側の設定を優先し、不十分な場合のみコード側で `data-clarity-mask` などの属性追加を検討します。

マスキング候補:

- 資産名
- 資産金額
- 毎月の積立額
- 資産メモ
- AI相談の入力内容
- AIの回答内容
- 診断回答
- 診断結果
- その他、個人の資産状況を推測できる情報

---

## Production Monitoring

新しい外部監視サービスは追加せず、現フェーズでは以下を最小構成とします。

### Release Time

- Vercel Deployment status
- Vercel Runtime Logs
- robots.txt / sitemap.xml / manifest.webmanifest の200確認
- 独自ドメイン、SSL、DNS
- Production URLの主要導線
- `/api/chat` fallback動作
- Supabase保存・取得
- `contact@aiassetlab.jp` の受信

### Daily

- Vercel Runtime Logsの重大error
- `/api/chat` のエラーまたはfallback増加
- Supabase関連の保存・取得エラー
- 問い合わせメール受信

### Weekly

- Search Consoleのsitemap状態
- Search Consoleのインデックス状況
- 404傾向
- robots.txt / sitemap.xml / manifest.webmanifest の200確認
- GA4でアクセスが継続していること
- GA4で主要ページのpage_viewが取得できていること
- GA4上の急激な計測停止または異常増加
- GA4確認は自分のテストアクセスだけで判断しないこと
- Clarity導入後の異常セッション

---

## Deployment Step 4 Manual Setup Checklist

Productionデプロイ前に、Vercel / DNS / メール管理画面で人間が確認する項目です。

- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_URL` を設定する
- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する
- [x] Vercel Production環境に `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` を設定する
- [ ] `OPENAI_API_KEY` と `OPENAI_MODEL` をProductionへ設定しない
- [ ] GA4 / Clarityは未設定のままにする
- [ ] Search Console verificationは独自ドメイン疎通後に設定する
- [x] `aiassetlab.jp` をVercel Domainsへ追加する
- [x] 必要に応じて `www.aiassetlab.jp` をVercel Domainsへ追加する
- [x] `https://aiassetlab.jp` をPrimary Domainに設定する
- [x] Vercel Dashboardに表示されたDNS設定をDNS管理画面へ反映する
- [x] DNS検証状態を確認する
- [x] SSL Certificate状態を確認する
- [ ] Production Deploymentへ独自ドメインが割り当てられることを確認する
- [x] Preview ProtectionがProductionドメインを遮断しないことを確認する
- [ ] `contact@aiassetlab.jp` のメールボックスまたは転送先を確認する
- [ ] 外部アドレスからテストメールを送信し、受信と返信を確認する

Production環境変数を変更した後は、Production Deploymentの再デプロイが必要です。今回はProductionデプロイを実行しません。

### Deployment Step 4 Result

2026-07-13時点で、Vercel Production環境と独自ドメイン設定は以下の状態です。

- `aiassetlab.jp`: Valid Configuration
- `www.aiassetlab.jp`: Valid Configuration
- SSL Certificate: 発行完了
- `https://aiassetlab.jp`: 表示確認OK
- `https://www.aiassetlab.jp`: 表示確認OK
- Vercel Authenticationによるブロックなし
- Production環境変数 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` は設定済み
- `www.aiassetlab.jp` から `https://aiassetlab.jp` への308 Permanent Redirectを確認済み
- `www.aiassetlab.jp/privacy` から `https://aiassetlab.jp/privacy` への308 Permanent Redirectを確認済み
- `contact@aiassetlab.jp` は作成済み、外部メールからの受信と返信を確認済み

Productionデプロイ未実行のため、現Production上では `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が404です。最新commitをProductionへデプロイした後、Production Smoke Testで再確認してください。

---

## Deployment Step 5 Pre-Deploy Status

2026-07-13時点のProductionデプロイ直前状態です。

- Branch: `feature/diagnosis-save`
- Latest committed baseline: `e8bf63a Deployment-Step3 Production Environment and Domain Readiness`
- Uncommitted changes: Step4 / Step5 documentation only
- Vercel CLI: Codex環境のPATHでは利用不可。`npx vercel --version` は利用可能だが、`npx vercel whoami` は認証確認でタイムアウト
- Vercel project link: `.vercel/project.json` 未作成
- Production deploy: 未実行
- Production Smoke Test: 未実行
- Current blocker before Go judgment: 最新ProductionデプロイとProduction Smoke Test

Codex側で安全にProductionデプロイを実行できないため、Vercel Dashboardで次の手順を実施してください。

1. GitHubにStep4 / Step5ドキュメント変更をcommit / pushする必要があるか、デプロイ対象に含める運用を確認する。
2. Vercel Dashboardで対象Projectを開く。
3. Deploymentsから `feature/diagnosis-save` の最新Deploymentを確認する。
4. ProductionへPromoteする場合は、対象commit hashが意図したものか確認する。
5. Production Branchへmerge / pushして自動Productionデプロイする場合は、merge対象と環境変数を確認する。
6. Productionデプロイ完了後、Production Deployment URLとcommit hashを記録する。
7. `https://aiassetlab.jp` でSmoke Testを実施する。

### Deployment Step 5 Result

2026-07-13時点で、ProductionデプロイとSmoke Testは完了しました。

- Production Deployment: Ready
- Production target commit: `e8bf63a`
- Production URL: `https://aiassetlab.jp`
- Production Deployment URL: Vercel Dashboardで確認
- Rollback target: Production公開前の直前正常Deployment
- `https://aiassetlab.jp`: 正常表示
- `https://www.aiassetlab.jp` から `https://aiassetlab.jp`: 308 Permanent Redirect確認済み
- SSL: 正常
- Vercel Authenticationによるブロックなし
- `robots.txt`: 200、`https://aiassetlab.jp/sitemap.xml` を参照
- `sitemap.xml`: 200、主要ページと `/privacy` / `/terms` 掲載確認
- `manifest.webmanifest`: 200、内容取得確認
- Top metadata: title / description / canonical確認済み
- canonical: `https://aiassetlab.jp`
- OGP image: `https://aiassetlab.jp/og-image.svg`
- Twitter metadata: `summary_large_image`
- Diagnosis: 5問回答から結果表示まで完走
- Portfolio: テスト資産登録・表示確認
- Dashboard: 合計・積立反映確認
- Portfolio削除: Portfolio / Dashboardとも元の状態へ復帰
- Chat: fallbackを初期公開仕様として維持
- Simulator: Preview QA済み、Production主要導線で重大問題なし
- Test data: 削除済み
- Major blocker: なし
- Production judgment: Go

残タスク:

- OpenAI API利用枠・Billing設定
- Search Console verification
- GA4 / Clarity導入判断
- Production監視
- 必要に応じたAnalytics導入Sprint

---

## Production Release Procedure

1. Vercel Production環境変数を設定する。
2. `NEXT_PUBLIC_SITE_URL` に `https://aiassetlab.jp` を設定する。
3. `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する。
4. 初回公開では `OPENAI_API_KEY` を設定しない。
5. 初回Production公開時点ではGA4 / Clarityを未設定にし、Search Console verificationは独自ドメイン疎通後に設定する。
6. Vercelで `aiassetlab.jp` と必要に応じて `www.aiassetlab.jp` を設定する。
7. DNSとSSLの状態を確認する。
8. `npm run build` を実行する。
9. Vercel Production deployを実行する。
10. `https://aiassetlab.jp` で疎通確認する。
11. TOP / Diagnosis / Portfolio / Dashboard / Chat / Simulator / Privacy / Terms / 404を確認する。
12. canonical / OGP / sitemap.xml / robots.txt / manifest.webmanifestを本番URLで再確認する。
13. Diagnosis結果遷移を確認する。
14. Portfolio登録・削除・Dashboard反映を確認し、テストデータを削除する。
15. Chat fallbackと「現在は簡易回答です。」表示を確認する。
16. `contact@aiassetlab.jp` の受信と返信元利用を確認する。
17. GA4 / Clarity / Search Consoleを有効化した場合は初回計測を確認する。GA4はProduction限定で導入済み、Clarityは未導入。

---

## Rollback Procedure

Production公開後に重大問題が見つかった場合は、次の順で対応します。

1. Vercelで直前の正常DeploymentをProductionへPromoteする。
2. 問題のあるDeploymentをProductionとして使い続けない。
3. 直近の環境変数変更を確認し、必要に応じて戻す。
4. Supabaseに意図しないデータ作成や破損がないか確認する。
5. 発生内容、影響範囲、暫定対応、恒久対応をドキュメントへ記録する。
6. 修正後はPreview QAを再実施してからProductionへ進める。
