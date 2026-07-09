# AI Asset Lab - Changelog

## 2026-07-09

### Sprint 14 - Portfolio v2

#### Added

- Portfolioに資産追加機能を追加
- Portfolioに資産編集機能を追加
- Portfolioに資産削除機能を追加
- 現在の資産合計を自動計算
- 毎月の積立額を自動計算
- 資産配分表示を追加
- localStorageによるブラウザ保存を追加
- PortfolioからSimulator / AI Chatへの導線を改善

#### Changed

- Portfolio画面を「見るだけ」から「自分の資産を登録できる画面」へ改善
- 初心者向けに文言を「Portfolio」ではなく「資産を見る」へ寄せた
- Asset関連の型・定数・計算・保存処理を責務分割

#### Notes

- Supabase保存は認証・ユーザーID設計とセットで実装する方が安全なため、Sprint14では実装しない。
- Sprint14ではまずユーザーが自分の資産を登録できる体験を優先し、ブラウザ保存で価値検証する。

---
