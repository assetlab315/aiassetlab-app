# AI Asset Lab Design System v1.0

AI Asset Lab は「AIと一緒に、毎日一歩ずつ資産形成を進める」サービスです。
UIは専門的に見せることより、迷わず行動できることを優先します。

---

## Design Principles

1. 迷わせない
2. 難しくしない
3. 次の一歩を必ず見せる
4. 数字は大きく、説明は短く
5. AIは賢く見せるより、寄り添って見せる

---

## Color

### Primary

- `blue-600`
- 主なCTA、重要な強調、AIらしさの表現に使用

### Text

- `slate-900`: 見出し
- `slate-700`: 本文の強調
- `slate-600`: 本文
- `slate-500`: 補足

### Background

- `slate-50`: ページ背景
- `white`: カード背景
- `blue-50`: 軽い強調

### Semantic

- `emerald`: 成長、積立、良い状態
- `amber`: 注意、見直し
- `red`: エラー、危険
- `violet`: AI、相談、提案

---

## Typography

### Hero

- `text-3xl md:text-4xl`
- `font-black`
- トップメッセージに使用

### Page Title

- `text-3xl`
- `font-black`

### Section Title

- `text-2xl`
- `font-black`

### Card Title

- `text-xl`
- `font-black`

### Body

- `text-base`
- `leading-7`

### Caption

- `text-sm`
- 補足情報、ラベルに使用

---

## Spacing

原則として以下のみを使います。

- `2` / 8px
- `3` / 12px
- `4` / 16px
- `5` / 20px
- `6` / 24px
- `8` / 32px
- `12` / 48px

---

## Radius

- `rounded-xl`: 入力欄、小さな要素
- `rounded-2xl`: 小カード
- `rounded-3xl`: メインカード
- `rounded-full`: ボタン、ステップ番号

---

## Shadow

- `shadow-sm` を基本とします。
- 強い影は使いすぎない。
- 高級感より、安心感と読みやすさを優先します。

---

## Buttons

### Primary

次に押すべき最重要CTAに使用します。

例:

- 資産を見る
- 計算する
- AIに相談する

### Secondary

補助行動に使用します。

### Outline

同じ重要度の別導線に使用します。

### Ghost

ヘッダーや軽い操作に使用します。

---

## Cards

### Default Card

通常情報を表示します。

### Feature Card

機能や行動カードに使用します。

### CTA Card

AIアドバイスや次の行動など、強い誘導に使用します。

---

## Layout

- ページ背景は `slate-50`
- 主要コンテンツは `PageContainer`
- セクション間は `space-y-6`
- モバイルファースト
- 390pxで横スクロールを出さない

---

## Accessibility

- CTAは意味が分かる文言にする
- 「開く」だけのボタンは禁止
- 色だけで意味を伝えない
- フォーカスリングを残す

---

## UX Rule

1画面につき、次に押すべき主CTAを1つ明確にする。
