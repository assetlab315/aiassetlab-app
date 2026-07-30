# AI Asset Lab - Changelog

## 2026-07-28

### Deployment Step 10-A2 - Supabase Preview Integration Hardening

#### Added

- Auth redirect guardを `lib/auth/redirect.ts` に切り出し、external URL、protocol-relative URL、encoded external URL、backslash、control characterを拒否する `test:auth-redirect` を追加
- logout isolationとoverwrite直前cloud再取得を検証する `test:logout-isolation` を追加
- Preview RLS検証用SQL `scripts/verify-supabase-rls.sql` を追加

#### Changed

- `/account` はSupabase設定済みかつ未ログインの場合、server側で `/login?next=/account` へredirect
- Portfolio conflict overwriteは保存直前にcloud件数を再取得し、変化があれば処理停止
- Portfolio同期UIへ `aria-live`、region label、保存中の二重送信抑止を追加
- SQL migrationへ資産名・memoの長さ制約を追加

#### Notes

- Supabase Project接続、SQL適用、Google OAuth、Email OTP、RLS実環境検証、Vercel Preview環境変数設定、Preview DeploymentはCodexでは実行していません
- Productionデプロイ、Production環境変数変更は実行していません
- build時にSupabase SSR middleware由来のEdge Runtime warningを確認。compile、type check、static generationは成功

## 2026-07-28

### Deployment Step 10-A1 - Supabase Auth and Portfolio Sync Foundation

#### Added

- Supabase Auth基盤、Google OAuth開始、Email OTP基盤、Auth callback、logout、Account画面を追加
- `@supabase/ssr` のbrowser/server client分離と `middleware.ts` によるCookie session refreshを追加
- Portfolio cloud sync用Repository、localStorage migration判定、conflict処理、ユーザー別cloud cacheを追加
- `portfolio_assets` / `portfolio_snapshots` のRLS付きSQL migrationを追加
- Auth/Sync検証用 `test:auth-foundation` / `test:portfolio-sync` を追加
- `.env.example`、Auth/Sync設計、Supabase setup手順を追加

#### Changed

- Portfolio画面に同期状態、migration確認、conflict選択、二段階overwrite確認を追加
- Privacy Policy / Termsへログイン情報、資産情報のクラウド保存、外部サービス利用、削除依頼運用の注意を追記
- Headerへログイン / アカウント導線を追加

#### Notes

- Productionデプロイ、Supabase SQL適用、Google OAuth設定、Vercel環境変数変更は実行していません
- Service Role Keyは使用していません
- 実Supabase Project、Google OAuth、RLS isolation、Preview OAuth確認はStep10-A2で実施します

## 2026-07-28

### Deployment Step 9-B - AI Portfolio Review

#### Added

- Dashboardに `AIレビュー` カードを追加
- `PortfolioInsights`、`DashboardInsights`、`AssetHealthScore`、`DashboardChangeSummary` から決定論的に総評を生成する `createPortfolioReview()` を追加
- `PortfolioReview` / `PortfolioReviewHighlight` 型を追加
- `test:portfolio-review` を追加し、no assets、no history、improved、mixed、needs_attention、no_change、禁止語、最大highlight数、Today Action / AI Insight / Health Score整合性を検証

#### Changed

- Dashboardのデータフローを、Change Summary確定後にAIレビューを生成する構成へ拡張
- ReviewはOpenAI APIを呼ばず、既存のローカル分析結果だけを使う構成に整理
- highlightは最大3件、summaryは1〜2文、next actionは既存Today Actionと矛盾しない文言へ制御

#### Notes

- OpenAI API、Chat API、Supabase、DB、Vercel設定、Productionデプロイは実行していません
- Production反映後にAIレビューの状態別Smoke Testが必要です

## 2026-07-27

### Deployment Step 9-A.1 - Remove Automatic Demo Portfolio Seeding

#### Fixed

- 新規ブラウザやプライベートブラウザで、本人が登録していないデモ資産2件が自動表示される問題を修正
- `loadPortfolioAssets()` がkeyなし、不正JSON、SSR時に `DEFAULT_ASSETS` を返していた挙動を停止
- Portfolio画面の開発者向け `デモ状態に戻す` ボタンをProduction UIから削除

#### Changed

- Portfolio localStorage key `aiassetlab_portfolio_assets_v1` が存在しない場合は空配列を返す
- 不正JSONや不正asset schemaではデモ資産へfallbackせず、安全な空状態または有効assetのみを返す
- Portfolio本体の自動保存をやめ、追加・編集・削除の確定時だけ保存する構成へ変更
- 資産0件ではStep9-Aのbaseline snapshotを作成しないことを検証

#### Notes

- Step9-A Production Smoke Testは完了扱いです
- 既存ユーザーのlocalStorage資産やsnapshot履歴は削除しません
- 修正後の新しいブラウザ状態でのみ、デモ資産が自動投入されないことを保証します
- Productionデプロイは実行していません

## 2026-07-27

### Deployment Step 9-A - Portfolio Change Tracking

#### Added

- Portfolio保存時にlocalStorageへ最大5件のPortfolio snapshotを保存する仕組みを追加
- `createPortfolioSnapshot()` / `portfolioSnapshotStorage` / `comparePortfolioSnapshots()` / `createDashboardChangeSummary()` を追加
- Dashboardに `前回からの変化` カードを追加
- `test:portfolio-change` を追加し、snapshot生成、fingerprint、storage耐性、比較、summary主要シナリオを検証

#### Changed

- Dashboardのデータフローを、現在の `PortfolioInsights` / `AssetHealthScore` と前回の異なるsnapshotを比較する構成へ拡張
- 比較表現は「前回の記録」「前回保存時」を基本とし、厳密な月次・日次比較に見える表現を避ける方針へ整理
- empty portfolio snapshotは保存せず、全資産削除時はDashboardの資産未登録状態を優先する設計へ整理

#### Notes

- Step8-BのProduction Smoke Testは完了扱いです
- OpenAI API、Supabase、DB、Chat API、Vercel設定、Productionデプロイは実行していません
- snapshotはブラウザlocalStorage内に保存され、複数端末同期はありません
- ブラウザデータ削除によりsnapshot履歴は消えます
- Production反映後にPortfolio Change TrackingのSmoke Testが必要です

## 2026-07-27

### Deployment Step 8-B - Explainable Asset Health Score

#### Added

- Dashboardに `Asset Health` カードを追加
- `PortfolioInsights` を入力にした決定論的ローカルスコア `createAssetHealthScore()` を追加
- `AssetHealthScore` / `AssetHealthScoreFactor` / `AssetHealthGrade` 型を追加
- `test:asset-health-score` を追加し、資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好、積立未設定、同一入力の再現性、factor合計との整合性を検証

#### Changed

- Dashboardのデータフローを `createPortfolioInsights()` から `createDashboardInsights()` と `createAssetHealthScore()` へ分岐する構成に整理
- Health Scoreは基準点60からfactorで加減点し、0〜100にclampする説明可能な算出へ整理
- 改善余地は `100 - score` ではなくnegative factorの絶対値合計で表示

#### Notes

- Step8-AのAI Dashboard Insightsは正式完了扱いです
- OpenAI API呼び出し、Chat API変更、DB変更、Vercel設定変更、Productionデプロイは実行していません
- スコアは資産配分と積立状況を基にした参考指標であり、投資成果予測ではありません
- Production反映後にAsset Health Scoreのパターン別Smoke Testが必要です

## 2026-07-27

### Deployment Step 8-A - AI Dashboard Insights

#### Added

- DashboardにPortfolio Insightsを再利用した `AI Insight` カードを追加
- `createDashboardInsights()` を追加し、資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好、積立未設定のDashboard向け短文Insightを生成
- `DashboardInsights` 型と `test:dashboard-insights` を追加

#### Changed

- Dashboardの旧AIインサイトを、独自集計ではなく `createPortfolioInsights()` 由来の分析結果から生成する構成へ変更
- hydration前に資産未登録Insightを一瞬表示しないよう、Dashboard Insight Cardに読み込み中skeletonを追加
- CTAを最大1つにし、実在するPortfolio / Simulator導線だけへ限定

#### Notes

- OpenAI API呼び出し、Chat API変更、DB変更、Vercel設定変更、Productionデプロイは実行していません
- Production反映後に、資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好のDashboard Smoke Testが必要です

## 2026-07-27

### Deployment Step 7-C.2 - Portfolio Insight Enforcement & Financial Fact Guard

#### Added

- 新NISAの固定知識を `lib/chat/financialKnowledge.ts` へ分離
- 現行新NISAのつみたて投資枠 年120万円、成長投資枠 年240万円、生涯非課税保有限度額 1800万円をpromptへ必要時のみ渡す構成を追加
- `test:portfolio-context` にNISA固定知識と旧制度年額を含めない検証を追加

#### Changed

- Portfolio分析を求める質問では、Portfolio Insightsがある場合に最低1点以上反映する指示を強化
- 資産情報未登録時は、具体的な資産配分分析ができないことを冒頭で明示する指示を強化
- Warningsがある場合、質問に関係するwarningを最低1つ反映する方針を補強
- 登録済みportfolioがある場合に「まず現在の資産を確認」で終わらせない制御を整理
- 旧つみたてNISAの年額上限を現行制度として案内しないよう金融制度ガードを追加

#### Notes

- Productionデプロイ、Vercel設定変更、OpenAI設定変更、モデル変更は実行していません
- Step7-C.2反映後に、同じPortfolio-aware No-GoケースとNISA制度回答のProduction Smoke Testが必要です

## 2026-07-27

### Deployment Step 7-C.1 - Portfolio Context Delivery Fix

#### Fixed

- Step7-C Production Smoke TestはNo-Go。資産未登録、現金90% / 株式10%、暗号資産70%の3ケースでPortfolio-aware回答が反映されませんでした
- ChatClientが実際のPortfolio保存キー `aiassetlab_portfolio_assets_v1` を読んでおらず、登録済みportfolioが `/api/chat` へ送られていない問題を修正
- ChatClientをPortfolio / Dashboardと同じ `loadPortfolioAssets()` 経由で読み込む構成へ変更
- 送信直前に最新portfolio contextを再取得し、hydration完了前の送信を抑止
- API validationで `amount/value/currentValue` と `monthlyContribution/monthlyInvestment/monthlyAmount/monthly` を扱えるように修正
- Portfolio Insightsのカテゴリ推定を正式category優先へ修正し、資産名推定は補助に限定
- 最終promptとOpenAI messagesへPortfolio Insightsが含まれることを検証する `test:portfolio-context` を追加

#### Notes

- Productionデプロイ、Vercel設定変更、OpenAI設定変更は実行していません
- 修正後、同じ3ケースでProduction Smoke Testが必要です

## 2026-07-27

### Deployment Step 7-C - Portfolio-Aware AI

#### Added

- `PortfolioInsights` 型と `createPortfolioInsights` utilityを追加
- Chat AIへPortfolio Summaryではなく、総資産、カテゴリ比率、集中度、分散状態、現金/株式/暗号資産の状態、warnings / strengths / recommendationsを含む分析済みInsightsを渡す構成へ変更

#### Changed

- Chat promptから個別資産一覧の読み上げを削減し、300文字程度のPortfolio Insightsへ圧縮
- system promptに、Portfolio Insightsを質問と関係ある場合のみ自然に利用し、数値一覧を読み上げない方針を追加
- 資産未登録時はInsightsを生成せず、「資産情報未登録」のみAIへ渡す構成へ整理

#### Notes

- Productionデプロイ、Vercel設定変更、OpenAI設定変更、モデル変更、DB変更は実行していません
- Step7-C反映後にPortfolio-aware回答のProduction Smoke Testが必要です

## 2026-07-27

### Deployment Step 7-B - AI Response Quality Improvement

#### Changed

- Production AI応答の初回Smoke Test成功を受け、AI相談の回答品質改善を実施
- Step7-A commit `f155569` がProduction反映済みであることを記録
- OpenAI Billing有効、初回クレジット5 USD、Auto recharge OFF、Production API key設定済み、`OPENAI_MODEL=gpt-4o-mini`、本番AI応答確認済みを記録
- system promptに、結論先出し、具体的な選択肢、生活防衛資金、分散、長期、継続、危険相談、機密情報、サービス内導線の扱いを追加
- user prompt生成で資産配分の概況、質問シグナル、新NISA・借入投資・個別銘柄・機密情報への回答方針を補強
- fallback回答を新NISA、資産未登録、借入投資、個別銘柄、機密情報入力へ最低限対応するよう改善

#### Notes

- Productionデプロイ、Vercel環境変数変更、OpenAI外部設定変更、モデル変更は実行していません
- Step7-B反映後にProduction AI応答のSmoke Testが必要です

## 2026-07-14

### Deployment Step 7-A - Chat Safety & Cost Controls

#### Changed

- Chat APIでmessage / history / portfolio文脈をサーバー側で検証し、過大な入力をOpenAIへ送らないように制限
- Chat Completions API requestに `max_tokens: 500` を追加
- OpenAI fetchに15秒timeoutを追加し、timeout時はfallback回答へ切り替え
- OpenAI non-OK、timeout、invalid JSON、malformed responseを安全な分類ログへ整理
- OpenAI responseに有効な回答がない場合も `source: "fallback"` を返すように修正
- IP単位のbest-effort in-memory rate limitを追加
- Chat UIで1,000文字超過、rate limit、連続送信抑止、AI回答の注意表示を追加
- Privacy Policyに外部AIサービス利用時の送信情報と機密情報入力禁止を明記
- Runbook / Environment / Release Checklist / HANDOFFへStep7-Aの安全対策と残タスクを反映

#### Notes

- OpenAI Billing、APIキー作成、Vercel環境変数設定、Productionデプロイは実行していません
- in-memory rate limitはServerless複数インスタンス間では完全共有されないため、OpenAI側Budget / Usage Limitとの併用が必須

## 2026-07-13

### Deployment Step 6 - Analytics & Post-Launch Foundation

#### Changed

- プライバシーポリシーを本番公開中のサービス向けに更新
- GA4 / Microsoft Clarityの読み込みをProduction環境かつ環境変数設定時のみに制限
- GA4の初回表示、App Router遷移計測、二重page_view確認方針をRunbookへ整理
- Clarity導入前の資産情報・AI相談内容・診断情報のマスキング方針を整理
- Search Console URLプレフィックス方式のverificationとsitemap送信成功を記録
- Production監視の最小構成をRelease時、Daily、Weeklyに分けて整理
- 既存GA4プロパティ「AI Asset Lab」のWeb Streamを利用し、Production限定で `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BB1DMLMD15` を設定
- Production再デプロイ後、GA4 Realtimeで初回ページビューとApp Router遷移後のDashboard page_viewを確認
- 今回の確認範囲では二重page_viewは発生していないため、明示的なpage_view送信コンポーネントは未追加

#### Notes

- GA4 Production計測は正常稼働として完了扱い
- Clarity Project IDは未設定で、Clarity計測は未開始

### Deployment Step 3 - Production Environment & Domain Readiness

#### Added

- `docs/04-release/PRODUCTION_RUNBOOK.md` を追加
- Production環境変数、独自ドメイン、contactメール、OpenAI fallback、Analytics、Production公開手順、Rollback手順を整理

#### Changed

- Environment Guideに初回Production公開時の `OPENAI_API_KEY` 未設定方針と非www Primary Domain方針を追記
- Release ChecklistにProductionドメイン、contactメール、Production Smoke Test、Rollback確認項目を追加

#### Notes

- Productionデプロイは実行せず、公開前の運用準備とドキュメント整備に限定
- 秘密情報や実際の環境変数値は記載していません

### Deployment Step 4 - Production Configuration & Domain Activation

#### Changed

- Production直前のVercel環境変数、独自ドメイン、DNS、SSL、contactメール確認手順をRunbookへ追記
- 初回Production公開ではGA4 / Microsoft Clarityを未設定とし、計測導入は公開時または公開後に判断する方針へ更新
- Release ChecklistにProduction環境変数設定、再デプロイ必要性、Search Console設定タイミングを追加
- Vercel Production環境変数、独自ドメイン、DNS、SSL、Vercel Authentication解除の完了結果を反映
- 現Production上で `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が404であり、最新Productionデプロイ後に再確認する必要があることを記録
- `www.aiassetlab.jp` から非wwwへの308 Permanent Redirect確認結果を反映
- `contact@aiassetlab.jp` の受信・返信確認完了を反映

#### Notes

- Productionデプロイ、Promote、Production Alias切り替え、commit、pushは実行していません
- 環境変数の実値、DNS認証情報、APIキーは記載していません
- Codex環境ではVercel CLIがPATHになく、Productionデプロイ操作は未実行です

### Deployment Step 5 - Production Deployment & Smoke Test

#### Changed

- Production Deployment ReadyとProduction対象commit `e8bf63a` を記録
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest` の404解消と200応答を確認
- Production実URLでcanonical、OGP、Twitter metadataが本番ドメインを参照することを確認
- Diagnosis、Portfolio、Dashboard、Chat fallback、主要導線のProduction Smoke Test完了を記録
- テストデータ削除済みとProduction Go判断を記録

#### Notes

- Step5事前Git確認を実施し、未コミット変更がStep4 / Step5ドキュメントのみであることを確認
- `.env` / `.env.local` はGit管理対象外であることを確認
- Productionデプロイ前の現Productionでは `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が404であることを再確認
- Vercel CLIがCodex環境のPATHになく、`npx vercel whoami` も認証確認でタイムアウトしたため、Productionデプロイは未実行
- `.vercel/project.json` がないため、Codex側からの安全なProject紐付け済みProductionデプロイは未確認
- ProductionデプロイはVercel側で完了済み。公開を妨げる重大不具合はありません
- 残タスクはOpenAI API利用枠・Billing、Search Console verification、GA4 / Clarity導入判断、Production監視

### Deployment Step 2 - Preview QA & Production Readiness

#### Changed

- Vercel Preview QAで確認する対象ページと挙動をRelease Checklistへ追加
- Shareable Preview URLでVercel SSOに止まらずアプリ本体へ到達できることを確認
- Shareable Preview URL上で主要ページ、404、sitemap.xml、robots.txt、manifest.webmanifest、metadata / OGP / canonicalの実出力を確認
- Chat APIがPreview環境でfallback回答を200で返すことを確認
- 実ブラウザでDiagnosis、Portfolio登録・削除、Dashboard反映、Chat fallback、Simulator、375px相当のモバイル表示を確認
- Production公開前の残タスクとして本番URL、独自ドメイン、contactメール、OpenAI、Analytics、Production Smoke Testを整理

#### Notes

- 新機能追加は行わず、公開前QAとProduction Readiness判断に限定
- Shareable Preview URLで公開前Preview QAは完了
- Production公開は本番環境変数と独自ドメイン等の運用設定確認後に進める

## 2026-07-10

### Deployment Step 1 - Vercel Preview Readiness

#### Changed

- `NEXT_PUBLIC_SITE_URL` でmetadataBase、canonical、sitemap、robots、外部サイトリンクのURLを切り替えられるように整理
- Vercel向けにNode.js 20以上のengines指定を追加
- Release ChecklistにVercel環境変数、Node.js、公開URL確認項目を追加
- Environment GuideにVercelで必要な環境変数一覧を追記

#### Notes

- APIキーの値は表示・保存・コミットせず、未設定でもbuild可能な設計を維持
- 本番公開は行わず、Vercel Preview Readiness確認に限定

## 2026-07-10

### Version 1.1 Sprint 5 - Launch Ready

#### Changed

- 全ページの主要導線、内部リンク、404 / Error導線を公開前に確認
- グローバルナビの「TOP」表記を「ホーム」へ統一
- 診断画面と診断結果画面の戻り導線を「ホームへ戻る」へ統一
- Portfolio内のDashboard戻り導線をNext Linkへ整理
- root layoutの共通Headerと重複していたPageContainer内Headerを削除

#### Removed

- 未使用になった旧AppHeaderコンポーネントを削除

#### Notes

- 新機能追加は行わず、公開前のBroken Link、Copy、Mobile、Accessibility、Cleanup確認に限定

## 2026-07-10

### Version 1.1 Sprint 4 - Release Management Foundation

#### Added

- `docs/04-release/RELEASE_CHECKLIST.md` を追加
- `docs/04-release/ENVIRONMENT.md` を追加
- AI、Analytics、Domain、Legal、Release、Post Releaseの公開前チェック項目を整理
- 公開環境で必要な環境変数一覧と用途を整理

#### Changed

- ROADMAPをVersion1.1、Version2 AI Coach、Version3 資産形成OSの流れへ整理
- PROJECT_PROGRESSにVersion1.1 Sprint4の完了内容を記録

#### Notes

- 新機能追加は行わず、公開前チェックリストと運営ドキュメント整備に限定

## 2026-07-10

### Version 1.1 Sprint 3 - Launch Readiness

#### Added

- 全体Footerに利用規約、プライバシーポリシー、お問い合わせ、Copyright、Version1.1表示を追加
- 最低限の利用規約ページを追加
- 最低限のプライバシーポリシーページを追加
- App Routerの500相当エラー画面を追加

#### Changed

- sitemapに利用規約とプライバシーポリシーを追加
- Footerをroot layout配下の共通表示へ整理
- 404と500の最低限の復帰導線を確認

#### Notes

- 新機能追加は行わず、公開に必要なLegal / Contact / Error導線の準備に限定

## 2026-07-10

### Version 1.1 Sprint 2 - Analytics Foundation

#### Added

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` によるGoogle Analytics 4計測コードの出し分けを追加
- `NEXT_PUBLIC_CLARITY_ID` によるMicrosoft Clarity計測コードの出し分けを追加
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` によるGoogle Search Console verification設定を追加
- HANDOFFにGA、Clarity、OpenAI、Search Console向けの環境変数一覧を追加

#### Notes

- 環境変数が未設定の場合、GA / Clarityは自動で無効
- Cookieバナーは追加せず、Version1.1では公開後の最低限の計測基盤に限定

## 2026-07-10

### Version 1.1 Sprint 1 - Public Release Foundation

#### Added

- 最低限のWeb App Manifestを追加
- favicon、icon、apple-touch-icon、OGP画像用の公開アセットを追加

#### Changed

- 全主要ページのmetadata title / descriptionを公開向けに見直し、重複しない内容へ整理
- Root metadataにOG image、Twitter large image、icons、manifest設定を追加
- 診断結果ページにcanonicalを追加し、個別結果ページはnoindexを維持
- 公開向けrobotsとsitemapの方針を確認

#### Removed

- 未使用の旧Chatモック返信ロジックを削除

#### Notes

- 新機能追加は行わず、Version1.0公開品質に向けたSEO、OGP、manifest、cleanupに限定

## 2026-07-10

### Sprint 27 - AI Chat Reliability Fix

#### Changed

- `/api/chat` から調査用の詳細console.logを削除
- OpenAI接続失敗時のログを最小限のerror messageに整理
- OpenAI APIキーやresponse bodyを本番ログに出さない方針へ整理
- AI Chatでfallback回答時に「現在は簡易回答です。」を小さく表示

#### Notes

- `source: "fallback"` を返す既存仕様は維持
- `OPENAI_API_KEY` と外部HTTPS通信許可が必要なことをHANDOFFへ追記

## 2026-07-09

### Sprint 26 - Version1 Release Review

#### Added

- App Routerの`robots.ts`と`sitemap.ts`を追加
- Root metadataにcanonical、OGP、Twitter card、robots設定を追加
- 主要ページにページ別metadataを追加

#### Changed

- PageContainerから重複していた独自Header / Footerを削除し、共通layoutナビへ統一
- 共通Buttonの最小高さを統一し、モバイルで押しやすく改善
- FeatureNavigationと資産一覧ボタンにfocus-visibleリングを追加
- 資産一覧の編集・削除ボタンにaria-labelを追加

#### Removed

- 未使用になっていたAppHeader / AppFooterを削除

#### Notes

- 新機能は追加せず、Version1公開前のSEO、アクセシビリティ、UI一貫性、cleanupに限定

## 2026-07-09

### Sprint 25 - Version1.0 Release Candidate Review

#### Changed

- TOPをDashboard直行から診断開始の入口へ変更
- 診断結果後の導線を「資産を見る」「Dashboardを見る」「AIに相談する」に統一
- Portfolio未登録時の空状態に、次に入力する内容を明示
- AI Chat未利用時の初期メッセージと資産未登録時のCTAを改善
- Morning Check未実施時のCTAを「今日の確認をする」へ短縮
- グローバルナビの順序とラベルを初回利用者向けに整理
- モバイル表示向けに主要カードの余白、ボタン高さ、チャット入力の並びを調整
- 主要入力・ボタンにaria-labelとfocus-visibleリングを追加

#### Removed

- 未使用の旧FeatureNavigationコンポーネントとfeatures/navigation関連ファイルを削除

#### Notes

- 新機能は追加せず、Version1.0 RCとして初回ユーザーが迷わないことを優先
- TOP / Diagnosis / Portfolio / Dashboard / AI Chat の流れを公開前の基本導線として整理

## 2026-07-09

### Sprint 24 - Daily Value

#### Added

- Dashboardに短文の「今日のAI」カードを追加
- 資産登録状況に応じて「今日は資産登録を1つ進めましょう。」「今日は積立を続けましょう。」などの一言を表示

#### Changed

- Dashboardの表示順を Hero / 今日のAI / 資産 / 今日やること に整理
- Morning Checkを今日やることの後ろへ移動し、今日のAIと役割が重ならない構成へ変更

#### Removed

- 未使用のDashboardAdvice型と生成関数を削除
- 未使用になっていたminimumMonthlyContribution定数を削除

#### Notes

- Version 1.0公開前のため、新機能は最小限の短文カードに限定
- 今日のAIは行動を増やすためではなく、Dashboardを今日開く理由を作るための表示として追加

## 2026-07-09

### Sprint 23 - First Impression Polish

#### Changed

- Dashboard Heroを「未来の資産を、今日少し前へ。」へ短縮し、第一印象を前向きに改善
- Hero CTAを「資産を見る」「AIに相談する」へ統一
- Dashboard周辺の「詳しく」系CTAを目的が分かる文言へ変更
- FeatureNavigationを Dashboard / Portfolio / AI Chat / Diagnosis の利用頻度順へ整理
- ActionCardと公開前確認カードの強調色をPrimary Color中心へ調整
- PageContainerの上下余白とカード間余白を、Mobile / Tablet / Desktopで自然になるよう調整

#### Notes

- 新機能は追加せず、Version 1.0公開前の第一印象と導線整理のみ実施
- Simulator自体は維持し、FeatureNavigationの並びからは公開前の利用頻度に合わせて外した

## 2026-07-09

### Sprint 22 - Dashboard Release Readiness / Final MVP Check

#### Added

- Dashboardに公開前の最終確認カードを追加
- 資産確認、次の行動、毎日の習慣の3観点でMVPの入口状態を確認できる表示を追加

#### Changed

- Dashboard下部のFeatureNavigation CTAを「開く」から「確認する」へ変更
- Version 1.0公開前チェックとして、Dashboard内の導線と確認ポイントを整理

#### Notes

- 新機能追加ではなく、公開前の最終確認と導線整理を目的としたSprint
- READMEはUTF-8で読み直し、文字化けのない状態で内容を確認済み

## 2026-07-09

### Sprint 21 - Dashboard Micro Polish / Daily Habit UX

#### Added

- Dashboardに毎日の習慣カードを追加し、今日の確認状態に応じて文言とCTAを出し分け

#### Changed

- 朝の確認カードのボタン文言と確認済み表示を改善
- 今日見るポイントを番号付きから確認後のチェック表示へ変化するUIに改善
- Dashboard内で重複していた「今日のチェック」表現を整理し、朝の確認と毎日の習慣の役割を分離
- PortfolioへのCTA文言を「資産を登録する」に統一

#### Notes

- 新機能追加ではなく、Version 1.0公開前のDashboard習慣化UXの磨き込み
- 認証未実装のため、確認済み状態は引き続きlocalStorageで保存

## 2026-07-09

### Sprint 20 - Dashboard Morning Experience / Daily Check Foundation

#### Added

- Dashboardに「朝の確認」カードを追加
- 今日の確認済み状態をlocalStorageに保存
- 資産登録状況に応じた朝の一言、今日見るポイント、CTAを生成するロジックを追加

#### Changed

- Dashboard Heroの文言を「毎朝30秒で確認する」体験に合わせて短く整理
- 習慣化カードの見出しを「毎日の習慣」へ変更
- Dashboard上のCTAを、確認後にAI相談へ自然につながる表現へ改善

#### Notes

- 認証未実装のため、Daily Checkの保存はlocalStorageを利用
- ストリークや履歴保存は、認証・ユーザー保存の導入後に拡張する

## 2026-07-09

### Sprint 19 - Version 1.0 UX Polish / Release Readiness

#### Changed

- Header / Dashboard / Portfolio / Chat の主要導線名を日本語で統一
- Dashboard下部のFeatureNavigationからMVP一覧導線を削除し、公開前ユーザー向けの導線に整理
- Premium候補カードの表現を「AI Premium 準備中」へ変更
- PortfolioのHero文言を、DashboardとAI相談につながる説明へ改善
- Chat画面の見出しと右サイド導線を「次に進む場所」に統一

#### Notes

- 新機能は追加せず、Version 1.0公開前の迷いやすい表現を削減
- Premiumの販売導線はまだ実装せず、価値検証の表現に留める

## 2026-07-09

### Sprint 18 - Dashboard AI Insight / Asset Impact

#### Added

- Dashboardに「今日のAIインサイト」カードを追加
- Dashboardに「あなたの資産への影響」カードを追加
- Portfolio登録内容から中心資産カテゴリと比率を読み取り、Dashboard上で表示
- 資産状況に応じた影響度、今日見るテーマ、おすすめ行動の生成ロジックを追加

#### Changed

- Dashboard Heroの文言を短くし、AIが話す領域をAIインサイトへ集約
- 「AIに相談する」導線を「詳しくAIに聞く」へ改善
- Dashboardを情報表示から、毎朝確認するホーム画面に近づける構成へ改善

#### Notes

- 実マーケットデータ連携は未実装
- Version 1.0では、外部ニュース取得よりも「自分の資産に関係あるか」を理解できるUXを優先

## 2026-07-09

### Sprint 17 - Dashboard v3.1 / Monetization Foundation

#### Added

- DashboardにPremium候補カードを追加
- 無料版で見える価値と将来のPremium候補を分けて表示
- 資産登録状況に応じてPremium導線の文言を自動出し分け
- Premium候補表示用の型と生成ロジックを追加

#### Changed

- Dashboardを「今日やること」だけでなく、将来の収益導線を検証できる画面へ改善
- 課金を急がせず、無料価値を先に体験してもらうコピーに整理

#### Notes

- 決済・ログイン・有料制御は未実装
- Version 1.0では、Premiumは販売ではなく価値検証導線として扱う

## 2026-07-09

### Sprint 16 - Dashboard v3

#### Added

- Dashboard v3 を追加
- DashboardでPortfolio v2 のlocalStorage資産情報を読み取り
- 資産合計、毎月積立、登録資産数、最大資産のサマリーを追加
- 資産状況に応じた今日のAIアドバイス生成処理を追加
- 次にやることを資産登録状況に応じて自動出し分け
- 習慣化UIの土台として今日のチェックカードを追加

#### Changed

- Dashboardを静的な案内画面から、ユーザーの資産状況に合わせたホーム画面へ改善
- AIAdviceCardを任意テキストを受け取れる再利用コンポーネントへ拡張

#### Notes

- 認証未実装のため、Portfolio連携は既存方針どおりlocalStorageを利用
- AI Premium導線はSprint17以降で検証する

## 2026-07-09

### Sprint 15 - AI Chat v2

#### Added

- AI Chat v2 を追加
- `/api/chat` を追加
- `OPENAI_API_KEY` が設定されている場合はOpenAI APIに接続
- APIキー未設定時でも動作するフォールバック回答を追加
- Portfolio v2 のlocalStorage資産情報を読み取り、AI相談の文脈として利用
- 総資産、毎月積立、登録資産数を表示するコンテキストパネルを追加
- 会話履歴を踏まえたプロンプト生成処理を追加
- おすすめ質問を追加
- 送信中表示を追加

#### Changed

- AI Chat画面を「単なるチャット」から「資産状況を踏まえた相談画面」へ改善
- 初心者向けの短く行動につながる回答方針へ統一

#### Notes

- Supabase保存やユーザー別履歴保存は、認証・RLS設計後に実装する
- OpenAI APIキーが未設定でもMVPとして動作する
