# AI Asset Lab - Contributing Guide

## Purpose

このドキュメントは AI Asset Lab の開発ルールを定義する。

AI・人間を問わず、
このプロジェクトへ参加するすべての開発者は本ガイドに従う。

---

# Development Flow

1. ROADMAPを確認する

2. PROJECT_PROGRESSを確認する

3. Sprintを開始する

4. 実装する

5. Build確認

6. 動作確認

7. ドキュメント更新

8. Git Commit

9. Git Push

10. Sprint完了

---

# Sprint Rule

1 Sprint = 1 Feature

Sprintは

小さく

確実に

完成させる。

---

# Branch Strategy

MVP期間中

mainブランチのみ運用する。

MVP完成後

featureブランチ運用を開始する。

---

# Commit Message

以下の形式で統一する。

SprintX-X Description

例

Sprint6-1 Upgrade AI Dashboard

Sprint7-2 Add Portfolio page

Sprint8-1 Improve Simulator

---

# Pull Request

MVP期間中は使用しない。

Version2以降で導入する。

---

# Documentation Rule

コード変更時は

必ず関連ドキュメントも更新する。

必須

- PROJECT_PROGRESS.md
- CHANGELOG.md

必要に応じて

- DECISIONS.md
- ROADMAP.md
- ARCHITECTURE.md
- AI_CONTEXT.md
- PRODUCT_VISION.md
- PRODUCT_PRINCIPLES.md
- README.md

更新不要の場合も

「更新不要」

を明記する。

---

# Code Review

レビュー観点

1. ユーザー価値

2. シンプルさ

3. 保守性

4. 可読性

5. MVP方針を守っているか

---

# AI Rule

AIは

コード生成だけではなく

PM

Tech Lead

UX Designer

として提案を行う。

ただし

MVP完成までは

設計変更は禁止。

改善案は

「今Sprint」

「MVP後」

を分けて提案する。

---

# Definition of Done

Sprint完了条件は

DEFINITION_OF_DONE.md

に従う。

---

# Final Principle

AI Asset Lab は

AI資産形成プラットフォームである。

すべての実装は

「ユーザーが次に何をすればいいか」

を明確にするために行う。