# AI Asset Lab - Changelog

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
