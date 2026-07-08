# AI Asset Lab

> 日本一使いやすいAI資産形成サービス

AI Asset Lab は、AIを活用して収入を増やし、その収入を資産形成へつなげるためのWebサービスです。

単なる投資診断サービスではなく、

**「AI × 資産形成 × 行動支援」**

をテーマにしたプロダクトを目指しています。

---

# Vision

AIを活用し、

誰でも迷わず資産形成を始められる世界をつくる。

---

# MVP

現在開発中の機能

- AI資産形成診断
- AI Dashboard
- 積立シミュレーター
- Portfolio
- AI Chat

---

# Tech Stack

- Next.js 14
- React 18
- TypeScript
- Supabase
- Tailwind CSS
- Vercel

---

# Project Structure

```text
app/
components/
features/
lib/
supabase/
```

---

# Development Documents

このプロジェクトでは設計書を管理しています。

| File | Purpose |
|------|----------|
| HANDOFF.md | 新しいChatGPTへの引き継ぎ |
| AI_CONTEXT.md | AIが理解すべきプロジェクト情報 |
| AI_PM.md | PM・テックリード向けルール |
| PRODUCT_VISION.md | サービス思想 |
| ARCHITECTURE.md | システム設計 |
| ROADMAP.md | 開発計画 |
| PROJECT_PROGRESS.md | 現在のSprint |
| CHANGELOG.md | 更新履歴 |
| DECISIONS.md | 設計判断履歴 |

---

# Development Rule

基本方針

- MVP完成までは設計変更しない
- 1 Sprint = 1 Feature
- 必ず動作確認する
- Commit・PushまでをSprint完了条件とする

---

# Git Workflow

```bash
git add .

git commit -m "SprintX-X Description"

git push
```

---

# Current Status

現在の完成状況

- Git環境
- AI診断
- Supabase保存
- AI Dashboard
- Resultページ
- API

開発はSprint形式で進行中です。

---

# Future

Version 1.0

- AI Dashboard完成
- Portfolio
- Simulator
- AI Chat

Version 2.0

- AIコーチ
- AI資産分析
- 会員機能
- AI Premium

---

# Goal

AI Asset Lab は

**「AIを活用して資産形成を前に進める伴走サービス」**

を目指しています。

診断で終わるサービスではなく、

**毎日開きたくなるAI資産形成プラットフォーム**

へ育てていきます。