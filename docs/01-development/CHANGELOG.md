# AI Asset Lab - Changelog

## 2026-07-09

### Sprint 12.5 - Build Fix

#### Fixed

- `/result` ページで `useSearchParams()` を直接使用していたため、Next.js 14 の production build で発生していた prerender error を修正
- `app/result/page.tsx` を Server Component に戻し、`Suspense` で Client Component を包む構成へ変更
- `useSearchParams()` を `app/result/ResultClient.tsx` に分離

#### Validation

- `npm run build` が成功することを確認対象に追加
