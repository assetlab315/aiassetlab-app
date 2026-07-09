# Decisions

## 2026-07-09

### Decision

Portfolio v2では、資産データの保存をまずlocalStorageで実装する。

### Reason

Supabase保存にはユーザー認証、user_id設計、RLS設計が必要になる。
認証前に共有DBへ資産データを保存すると、データ分離とセキュリティの観点で危険がある。

Sprint14では、ユーザーが「自分の資産を登録して確認できる」体験を最優先し、ブラウザ保存で価値検証する。

### Future

Sprint17以降の認証・マイページ実装後に、PortfolioデータをSupabaseへ移行する。
