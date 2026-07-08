# AI Asset Lab - Architecture

## Overview

AI Asset Lab は

Next.js App Router を中心とした

シンプルな構成を採用する。

MVP完成までは

アーキテクチャを変更しない。

---

# Technology Stack

Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

Backend

- Supabase

Hosting

- Vercel

Version Control

- Git
- GitHub

---

# Architecture

Browser

↓

Next.js

↓

API Route

↓

Supabase

↓

PostgreSQL

---

# Design Policy

シンプルさを最優先する。

過度なレイヤー分割は行わない。

---

# Feature Policy

機能ごとに責務を分ける。

app/

画面

features/

ビジネスロジック

components/

UI

lib/

共通処理

---

# API Policy

App Router の

Route Handler

を利用する。

---

# Database Policy

Supabaseを唯一のDBとする。

ORMは導入しない。

---

# Authentication

MVPでは未実装。

Version1.1で対応予定。

---

# State Management

React Hooksを利用。

グローバル状態管理は

MVPでは導入しない。

---

# Future

MVP完成後

必要に応じて

Server Actions

認証

キャッシュ

を追加する。