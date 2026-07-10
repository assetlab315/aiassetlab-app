# AI Asset Lab - Project Progress

## Current Sprint

### Version 1.1 Sprint 2

**Status**

✅ Completed

---

## Current Goal

Analytics Foundation

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

## Next Sprint

Version 1.1 Sprint 3

Public Release Final Verification

予定

- 公開URLでのmetadata / OGP表示確認
- スマホ実機相当の最終表示確認
- README / HANDOFF の公開直前確認
- 既知の未実装範囲とMVP完了範囲の再確認

---

## MVP Progress

██████████ 100%

---

## Version 1.0 Progress

██████████ 100%

---

Last Updated

2026-07-10
