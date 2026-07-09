# AI Asset Lab - Changelog

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
