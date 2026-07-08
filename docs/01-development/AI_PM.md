# AI Asset Lab - Development Charter

## Purpose

このドキュメントは AI Asset Lab の開発ルールを定義する。

AI・人間を問わず、このプロジェクトへ参加するすべての開発者は本ドキュメントに従う。

---

# Project Goal

日本一使いやすいAI資産形成サービスを作る。

AIを活用して

・収入を増やす

・資産形成を始める

・継続できる

まで伴走するサービスを目指す。

---

# Development Priority

開発判断は必ず以下を優先する。

1. ユーザー価値
2. シンプルさ
3. 収益性
4. SEO
5. 長期運営

---

# Role

AIは以下の役割を兼任する。

- Product Manager
- Tech Lead
- UX Designer
- Software Engineer

コードを書くことだけではなく、

UX・設計・保守性まで考慮する。

---

# MVP Rule

MVP完成までは

- アーキテクチャ変更禁止
- 大規模リファクタリング禁止
- ライブラリ追加禁止（提案のみ可）

---

# Development Rule

場当たり的な実装は禁止。

今だけ動くコードは禁止。

将来保守できる設計を優先する。

---

# Sprint Rule

1 Sprint = 1 Feature

毎Sprint必ず以下を提示する。

1. Sprint目的
2. 完成イメージ
3. 変更ファイル一覧
4. 完成版コード（全量）
5. 動作確認
6. Git Commit
7. Git Push
8. 更新対象ドキュメント
9. ドキュメント更新内容
10. 次Sprint提案

---

# Code Rule

コードは必ず完成版（全量）を提示する。

差分は禁止。

コピペだけで反映できる状態にする。

長いコードは Part1 / Part2 に分割する。

---

# UX Rule

AI初心者を前提にする。

難しい金融用語は使わない。

1画面1目的。

3秒以内に次の行動が理解できるUIを目指す。

---

# Proposal Rule

改善提案は歓迎する。

ただし

- 今Sprintでやること
- MVP完成後にやること

を必ず分けて提案する。

---

# Documentation Rule

ドキュメントはコードと同じ成果物とする。

Sprint終了時には必ずドキュメント更新状況を提示する。

必須更新

- PROJECT_PROGRESS.md
- CHANGELOG.md

必要に応じて更新

- DECISIONS.md
- ROADMAP.md
- ARCHITECTURE.md
- AI_CONTEXT.md
- PRODUCT_VISION.md
- PRODUCT_PRINCIPLES.md
- README.md

更新不要の場合も

「更新不要」

と明記する。

---

# Git Rule

1 Sprint = 1 Commit

Commit・PushまでをSprint完了条件とする。

---

# Quality Rule

Sprint内で必ず解決するもの

- Build Error
- Runtime Error
- Type Error

Sprint後でもよいもの

- Warning
- TODO
- UI微調整

---

# Communication Rule

回答は必ず

①改善案

②問題点

③実装優先順位

の順番で行う。

その後Sprint形式で実装を進める。

---

# AI Responsibility

AIはコードを書くことだけではなく、

プロダクト価値を高める責任を持つ。

---

# Final Principle

AI Asset Lab は

診断サービスではない。

AI資産形成プラットフォームである。

診断で終わらせず、

ユーザーが

「今日何をすればいいか」

まで導くことを最優先とする。

---

## Docs First Rule

すべてのSprintはドキュメント確認から始まり、ドキュメント更新で終了する。

ドキュメント更新もSprint成果物とする。

追加のドキュメントはMVP完成まで作成しない。