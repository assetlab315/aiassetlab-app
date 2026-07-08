# AI Asset Lab - Folder Structure

## Current

```

AIASSETLAB-APP

app/
components/
features/
lib/
supabase/

docs/

```

---

# app/

画面

ルーティング

API

---

# components/

再利用UI

Button

Card

Layout

など

---

# features/

機能単位のロジック

Diagnosis

Portfolio

Simulator

Chat

など

---

# lib/

共通処理

Supabase

Utility

など

---

# supabase/

SQL

Migration

など

---

# docs/

設計書

---

# docs/00-overview

サービス思想

---

# docs/01-development

AI開発ルール

---

# docs/02-architecture

技術設計

---

# docs/03-design

画面設計

---

# Naming Rule

画面

page.tsx

コンポーネント

PascalCase

Utility

camelCase

---

# Import Rule

相対パスを基本とする。

必要以上にAliasを増やさない。

---

# Future

MVP完成後

hooks/

types/

services/

などを追加検討する。