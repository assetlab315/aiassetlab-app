# AI Asset Lab UI Components

## Layout

### AppHeader

全ページ共通のヘッダーです。

表示ラベル:

- ホーム
- 資産
- 将来のお金
- AIに相談

### PageContainer

ページ全体の背景、Header、Footer、中央寄せを担当します。

---

## UI

### Button

Variants:

- `primary`: 最重要CTA
- `secondary`: 補助CTA
- `outline`: 並列導線
- `ghost`: 軽い操作

Rule:

- ボタン文言は「開く」ではなく、行動が分かる言葉にする

---

### Card

Variants:

- `default`: 通常カード
- `feature`: 機能カード
- `cta`: 強い行動誘導
- `soft`: 補足情報

---

## Common

### SectionHeader

セクションの見出しと説明を統一します。

### ActionCard

Dashboardの「今日やること」に使います。

### AIAdviceCard

AI Asset Labらしい体験を作るカードです。

---

## Dashboard Pattern

Dashboardは以下の順番にします。

1. Hero
2. 今日のAIアドバイス
3. 今日やること
4. 機能ナビゲーション

---

## Quality Rule

新しい画面を作るときは、既存コンポーネントを優先して使います。
