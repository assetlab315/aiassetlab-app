# AI Asset Lab - Changelog

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
