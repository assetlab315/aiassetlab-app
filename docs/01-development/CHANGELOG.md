# AI Asset Lab - Changelog

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
