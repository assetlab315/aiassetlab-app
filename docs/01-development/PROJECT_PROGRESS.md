# AI Asset Lab - Project Progress

## Current Sprint

### Deployment Step 6

**Status**

✅ Completed

---

## Current Goal

Analytics & Post-Launch Foundation

---

## Completed

### MVP

- AI診断
- Supabase保存
- Resultページ
- Dashboard
- Portfolio
- Simulator
- AI Chat
- MVP Navigation

### Version 1.0 Foundation

- UX Foundation
- Design System
- Dashboard UX
- Build Fix
- Project Quality Settings

### Portfolio v2

- 資産追加
- 資産編集
- 資産削除
- 資産合計
- 毎月積立合計
- 資産配分表示
- localStorage保存

### AI Chat v2

- OpenAI API連携用エンドポイント
- APIキー未設定時のフォールバック回答
- 資産情報を踏まえたチャット文脈
- 会話履歴を踏まえたプロンプト生成
- おすすめ質問
- 資産状況パネル
- 送信中表示

### Dashboard v3

- Portfolio v2 のlocalStorage資産情報をDashboardへ反映
- 資産合計、毎月積立、登録資産数、最大資産を表示
- 資産状況に応じた今日のAIアドバイスを表示
- 次にやることを登録状況に応じて自動出し分け
- 習慣化UIの土台として今日のチェックカードを追加

### Dashboard v3.1 / Monetization Foundation

- Dashboard上にPremium候補カードを追加
- 無料版で見える価値と将来の有料価値を分けて表示
- 資産登録状況に応じてPremium導線の文言を出し分け
- 課金を急がせず、まず無料価値を体験してもらう導線に整理

---

### Dashboard AI Insight / Asset Impact

- Dashboard Heroの文言を整理
- 今日のAIインサイトを追加
- 資産登録内容から中心資産カテゴリと比率を表示
- あなたの資産への影響カードを追加
- 今日見るテーマとおすすめ行動を資産状況に応じて出し分け
- AI相談導線を「詳しくAIに聞く」に改善

### Version 1.0 UX Polish / Release Readiness

- Header / Dashboard / Portfolio / Chat の主要導線名を日本語で統一
- Dashboard下部のFeatureNavigationからMVP一覧導線を削除し、公開前ユーザー向けの導線に整理
- Premium候補の表現を「AI Premium 準備中」へ変更し、内部検証感を減らす
- Portfolio / Chat の見出しとCTAを「ホーム起点」の体験に統一
- Release前に迷いやすい英語ラベルと内部向け表現を削減

### Dashboard Morning Experience / Daily Check Foundation

- Dashboardに「朝の確認」カードを追加
- 今日の確認済み状態をlocalStorageで保存
- 資産登録状況に応じて朝の一言、見るポイント、次のCTAを出し分け
- Hero文言をさらに短くし、毎朝30秒で確認する体験へ整理
- 習慣化カードの表現を「毎日の習慣」へ改善

### Dashboard Micro Polish / Daily Habit UX

- Dashboardに毎日の習慣カードを追加
- 今日の確認状態に応じて、習慣カードの文言とCTAを自動で出し分け
- 朝の確認カードのボタン文言と確認済み表示を改善
- 今日見るポイントを、未確認時は番号、確認後はチェック表示に変化するUIへ改善
- 「今日のチェック」表現の重複を削減し、朝の確認と毎日の習慣の役割を分離

### Dashboard Release Readiness / Final MVP Check

- Dashboardに公開前の最終確認カードを追加
- 資産確認、次の行動、毎日の習慣の3観点でVersion 1.0入口としての状態を明示
- 下部のFeatureNavigation CTAを「開く」から「確認する」へ変更し、行動が分かる導線に改善
- 新機能を増やさず、Dashboard全体の公開前チェックに必要な文言と導線を整理

### First Impression Polish

- Dashboard Heroを短く、未来志向のコピーへ改善
- Hero CTAを「資産を見る」「AIに相談する」に統一し、目的が分かる導線へ整理
- FeatureNavigationを利用頻度順に変更し、Dashboard / Portfolio / AI Chat / Diagnosis の順序へ整理
- Dashboard周辺の「詳しく」系CTAを目的が分かる文言へ変更
- 緑・紫の強調色を減らし、Primary Color中心の見え方へ調整
- PageContainerの余白をDesktop / Tablet / Mobileで自然になるよう調整

### Daily Value

- Dashboardに短文の「今日のAI」カードを追加
- 資産登録状況、積立額、資産比率に応じて今日開く理由を1文で表示
- Dashboardの順序を Hero / 今日のAI / 資産 / 今日やること に整理
- Morning Checkを今日やることの後ろへ移動し、今日のAIとの役割重複を回避
- 未使用のDashboardAdvice型と生成関数、不要定数を削除

### Version1.0 Release Candidate Review

- TOPをDashboard直行から診断開始の入口へ変更し、初回導線を TOP / Diagnosis / Portfolio / Dashboard / AI Chat に整理
- Portfolio未登録時に「次にやること」を明示し、資産登録フォームへ迷わず進める空状態へ改善
- AI Chat未利用時の初期メッセージと資産未登録時の文脈パネルCTAを改善
- Morning Check未実施時のCTAを「今日の確認をする」へ短縮し、スマホでも理解しやすく整理
- 診断結果後の導線を「資産を見る」「Dashboardを見る」「AIに相談する」に統一
- モバイル余白、ボタン高さ、フォーカスリング、aria-labelを主要入力・ボタンへ追加
- 未使用の旧FeatureNavigation関連ファイルを削除し、グローバルナビのラベルと順序を整理

### Version1 Release Review

- Root metadataをVersion1向けのtitle / description / canonical / OGP / robots設定へ整理
- 主要ページにページ別metadataを追加し、診断ページは専用layoutでmetadataを管理
- robots.txt と sitemap.xml をApp Routerで生成
- 重複していたPageContainer内の独自Header / Footerを削除し、共通layoutナビへ統一
- 旧AppHeader / AppFooterの未使用ファイルを削除
- 共通Button、FeatureNavigation、資産一覧の編集/削除ボタンのフォーカスと押しやすさを改善
- 資産一覧ボタンにaria-labelを追加し、操作対象が分かるよう改善

### AI Chat Reliability Fix

- `/api/chat` から調査用の詳細console.logを削除
- OpenAI接続失敗時は最小限のerror messageのみをconsole.errorへ出力
- OpenAI APIキーやOpenAI response bodyを本番ログに出さない方針へ整理
- fallback回答時も `source: "fallback"` を返す既存仕様を維持
- Chat UIでfallback回答時に「現在は簡易回答です。」を小さく表示
- HANDOFFに `OPENAI_API_KEY` と外部HTTPS通信許可の注意を追記

### Version 1.1 Public Release Foundation

- Version1.1の開始を記録
- 全主要ページのmetadata title / descriptionを公開向けに整理
- Root metadataにOG image、Twitter large image、icons、manifest設定を追加
- favicon、icon、apple-touch-icon、OGP画像用の公開アセットを追加
- 最低限のWeb App Manifestを追加
- robotsは公開向けにindex/followを維持し、APIのみdisallowを確認
- sitemapは公開導線ページを維持し、noindexの診断結果ページは除外方針を確認
- 未使用の旧Chatモック返信ロジックを削除

### Version 1.1 Analytics Foundation

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` が設定されている場合のみGA4計測コードを読み込む構成を追加
- `NEXT_PUBLIC_CLARITY_ID` が設定されている場合のみMicrosoft Clarity計測コードを読み込む構成を追加
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` をmetadata verificationで管理できるよう整理
- Cookieバナーは追加せず、公開後の最低限の計測基盤に限定
- HANDOFFにGA、Clarity、OpenAI、Search Consoleの環境変数一覧を追加

### Version 1.1 Launch Readiness

- 全体Footerに利用規約、プライバシーポリシー、お問い合わせ、Copyright、Version1.1表示を追加
- 最低限の利用規約ページとプライバシーポリシーページを追加
- お問い合わせ導線を `mailto:contact@aiassetlab.jp` としてFooterとLegalページへ追加
- App Routerの500相当エラー画面を追加
- 404ページの最低限の復帰導線を確認
- sitemapにLegalページを追加
- Footerをroot layout配下の共通表示へ整理

### Version 1.1 Release Management Foundation

- `docs/04-release/RELEASE_CHECKLIST.md` を追加
- `docs/04-release/ENVIRONMENT.md` を追加
- AI、Analytics、Domain、Legal、Release、Post Releaseの公開前チェック項目を整理
- OpenAI、GA4、Clarity、Search Consoleの環境変数一覧と用途を整理
- ROADMAPをVersion1.1、Version2 AI Coach、Version3 資産形成OSの流れへ更新

### Version 1.1 Launch Ready

- TOP、Diagnosis、Portfolio、Dashboard、Chat、Simulator、Result、Privacy、Terms、404、Errorの主要導線を確認
- 内部リンクを確認し、Portfolio内のDashboard戻り導線をNext Linkへ整理
- 「TOP」表記を「ホーム」へ統一
- root layoutの共通Headerと重複していたPageContainer内Headerを削除
- button、aria-label、focus-visible、モバイル余白、スクロール量を公開前観点で確認
- 未使用になった旧AppHeaderコンポーネントを削除

### Deployment Step 1 - Vercel Preview Readiness

- package.jsonのbuild / start scriptsを確認
- Next.js設定がVercel標準で動作することを確認
- Node.js 20以上のengines指定を追加
- `.env.local` がgitignoreされていることを確認
- `NEXT_PUBLIC_SITE_URL` でmetadataBase、canonical、sitemap、robots、外部サイトリンクのURLを切り替えられるように整理
- サーバー専用のOpenAI環境変数と `NEXT_PUBLIC_*` の分離を確認
- Release ChecklistとEnvironment GuideにVercel Preview前の環境変数確認項目を追記

### Deployment Step 2 - Preview QA & Production Readiness

- `npm run build` が成功することを確認
- ビルド成果物でTOP、Diagnosis、Portfolio、Dashboard、Chat、Simulator、Privacy、Terms、404の生成を確認
- `sitemap.xml`、`robots.txt`、`manifest.webmanifest` の生成を確認
- metadata / OGP / canonical がビルド成果物へ出力されることを確認
- Shareable Preview URLでVercel SSOに止まらずアプリ本体へ到達できることを確認
- Shareable Preview URL上でTOP、Diagnosis、Portfolio、Dashboard、Chat、Simulator、Privacy、Terms、404、sitemap.xml、robots.txt、manifest.webmanifestのHTTP応答を確認
- Chat APIがPreview環境で `source: "fallback"` を200で返すことを確認
- canonical、robots、sitemapは `https://aiassetlab.jp` を出力し、OG imageはPreview URL配下の `og-image.svg` を出力することを確認
- 実ブラウザで主要ページ、404、ヘッダー、フッター、内部リンク、横スクロール有無を確認
- 375px相当のモバイル表示で主要ページの横スクロールなしを確認
- Diagnosisを最初から実行し、`/result?id=...` への遷移、結果表示、次アクション導線を確認
- Portfolioにテスト資産を登録し、Dashboardの合計・積立額へ反映されることを確認後、テスト資産を削除
- Chatでメッセージ送信後、fallback回答と「現在は簡易回答です。」の表示を確認
- Simulatorで入力値変更、計算結果表示、空/不正値での重大な崩れなしを確認
- Browser Consoleで重大なerror / warningが出ないことを確認
- Production公開判断はPreview QA観点ではGo。ただし本番環境変数、独自ドメイン、contactメール、OpenAI利用枠、Analytics設定、Production Smoke Test完了後に公開する

### Deployment Step 3 - Production Environment & Domain Readiness

- Production環境変数を必須、本番公開時に設定、任意に分類
- Supabase、OpenAI、Analytics、Search Console、公開URLの参照箇所と未設定時の動作を確認
- `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` と非www Primary Domain方針を整理
- Vercel独自ドメイン設定、DNS、SSL、Production Deployment紐付け、Preview Protection確認手順を整理
- `contact@aiassetlab.jp` の受信、迷惑メール、Footer / Legal記載整合、返信元確認を公開前項目として整理
- 初回Production公開では `OPENAI_API_KEY` を設定せず、Chat fallbackを正常仕様として扱う方針を確認
- GA4 / Clarity / Search Console verificationの公開初日設定方針とCookieバナー未実装時の注意事項を整理
- Production公開手順とRollback手順を `docs/04-release/PRODUCTION_RUNBOOK.md` に整理
- Productionデプロイは未実行

### Deployment Step 4 - Production Configuration & Domain Activation

- 現在ブランチ、git status、最新commit、build / start scripts、Production向け環境変数一覧を確認
- Vercel Production環境に設定する必須環境変数と、今回設定しないOpenAI / Analytics系環境変数を整理
- `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` と非www Primary Domain方針を再確認
- Vercel Dashboardでの独自ドメイン、DNS検証、SSL、Production Deployment紐付け、Preview Protection確認手順を整理
- Vercel Production環境変数 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` の設定完了を反映
- `aiassetlab.jp` と `www.aiassetlab.jp` のValid Configuration、SSL発行完了、Vercel Authenticationブロックなしを反映
- `https://aiassetlab.jp` と `https://www.aiassetlab.jp` の表示確認OKを反映
- `www.aiassetlab.jp` と `www.aiassetlab.jp/privacy` から非wwwへの308 Permanent Redirectを確認
- 現Production上では `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が404のため、最新Productionデプロイ後のSmoke Testで再確認する
- `contact@aiassetlab.jp` の作成、外部メールからの受信、返信成功を反映
- 初回Production公開ではGA4 / Clarityを未設定にし、Search Console verificationは独自ドメイン疎通後に設定する方針へ更新
- OpenAI APIはProductionに設定せず、Chat fallbackを初期公開仕様として維持
- Productionデプロイ、Promote、Production Alias切り替え、commit、pushは未実行

### Deployment Step 5 - Production Deployment & Smoke Test

- Step5事前Git確認を実施
- 現在ブランチが `feature/diagnosis-save` であることを確認
- 最新commitが `e8bf63a Deployment-Step3 Production Environment and Domain Readiness` であることを確認
- 未コミット変更がStep4 / Step5ドキュメントのみであることを確認
- `.env` / `.env.local` がGit管理対象外であることを確認
- Vercel CLIがCodex環境のPATHになく、`npx vercel whoami` も認証確認でタイムアウトしたため、Codex側からのProductionデプロイは未実行
- `.vercel/project.json` がないため、Codex側で安全なVercel Project紐付けを確認できない状態
- Production Deployment Readyを確認
- Production対象commit `e8bf63a` を記録
- `https://aiassetlab.jp` の正常表示、SSL正常、Vercel Authenticationブロックなしを確認
- `www.aiassetlab.jp` から非wwwへの308 Permanent Redirectを確認
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が200になり、404解消を確認
- sitemapに主要ページと `/privacy` / `/terms` が掲載されていることを確認
- canonical、OGP、Twitter metadataが本番ドメインを参照することを確認
- Diagnosisは5問回答から結果表示まで完走
- Portfolioでテスト資産登録、Dashboard合計・積立反映、削除後の復帰を確認
- Chat fallbackを初期公開仕様として確認
- テストデータ削除済み
- 公開を妨げる重大不具合なし
- Production判断はGo

### Deployment Step 6 - Analytics & Post-Launch Foundation

- Privacy Policyから公開準備用プレースホルダー表現を削除し、本番公開中の取り扱い方針へ更新
- GA4 / Clarityのscript読み込みをProduction環境かつ環境変数設定時のみに制限
- GA4はProduction環境のみID設定し、Preview / Developmentには設定しない方針を整理
- GA4のApp Router遷移計測はEnhanced Measurement確認後に判断し、今回は明示的なpage_view送信コンポーネントを追加しない方針を整理
- Clarityは後続Sprintで導入判断し、資産情報、AI相談内容、診断情報のマスキング方針を整理
- Search Console URLプレフィックス方式のverificationとsitemap送信成功を記録
- Production監視をRelease時、Daily、Weeklyの最小構成に整理
- GA4 Measurement ID、Clarity Project ID、Vercel Production環境変数は未設定
- Productionデプロイは未実行

## Next Sprint

Post Release Analytics Setup

GA4 Introduction Decision

予定

- GA4プロパティとWeb Streamの確認
- Vercel Production環境へのGA4 ID設定判断
- GA4 Realtime / DebugView確認
- App Router遷移のpage_view確認
- Clarity導入前のマスキング設定確認
- Production監視
- 必要に応じたAnalytics導入Sprint

---

## MVP Progress

██████████ 100%

---

## Version 1.0 Progress

██████████ 100%

---

Last Updated

2026-07-13
