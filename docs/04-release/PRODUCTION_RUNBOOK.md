# AI Asset Lab - Production Runbook

Production公開前後に確認する運用手順です。秘密情報や実際のキー値は記載しません。

---

## Production Environment Variables

### Required

| Name | Scope | Reference | Production behavior |
|------|-------|-----------|---------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client public | `lib/supabase.ts` | Diagnosis結果の保存・取得に必要 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client public | `lib/supabase.ts` | Diagnosis結果の保存・取得に必要 |

`NEXT_PUBLIC_` で始まる値はブラウザへ公開されます。Supabase anon keyは公開前提のキーですが、service role keyなどの秘密情報は絶対に入れないでください。

### Set for Production

| Name | Scope | Reference | Production behavior |
|------|-------|-----------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | Client public / build metadata | `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts` | `https://aiassetlab.jp` を設定し、canonical、OGP、robots、sitemap、ヘッダーの外部リンクを本番URLへ揃える |

Productionの正規URLは `https://aiassetlab.jp` を推奨します。`www.aiassetlab.jp` を追加する場合は、Vercelで非wwwの `https://aiassetlab.jp` をPrimary Domainにし、www側は非wwwへリダイレクトする方針にします。

### Optional

| Name | Scope | Reference | Production behavior when unset |
|------|-------|-----------|--------------------------------|
| `OPENAI_API_KEY` | Server only | `app/api/chat/route.ts` | Chat APIはfallback回答を200で返す |
| `OPENAI_MODEL` | Server only | `app/api/chat/route.ts` | `gpt-4o-mini` を利用する |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Client public | `app/layout.tsx` | GA4 scriptを読み込まない |
| `NEXT_PUBLIC_CLARITY_ID` | Client public | `app/layout.tsx` | Microsoft Clarity scriptを読み込まない |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Client public metadata | `app/layout.tsx` | Google verification metadataを出力しない |

PreviewとProductionでは、少なくとも `NEXT_PUBLIC_SITE_URL` を環境ごとに分けて確認します。Productionでは `https://aiassetlab.jp` を使用します。

`.env.local` と `.env` は `.gitignore` でGit管理対象外です。値をドキュメント、ログ、コミットへ記載しないでください。

---

## Domain Setup in Vercel

1. Vercel ProjectのDomains画面を開く。
2. `aiassetlab.jp` を追加する。
3. 必要に応じて `www.aiassetlab.jp` も追加する。
4. Vercel画面に表示されたDNS設定を、利用中のDNS管理サービスへ設定する。DNS値はVercel画面の表示に従い、固定値として記録しない。
5. `https://aiassetlab.jp` をPrimary Domainに設定する。
6. `www.aiassetlab.jp` を追加した場合は、非www側へリダイレクトされることを確認する。
7. SSL証明書が発行済みになっていることを確認する。
8. Production Deploymentが独自ドメインに紐付いていることを確認する。
9. Preview ProtectionがProductionへの通常アクセスを意図せず妨げていないことを確認する。

---

## Contact Address Check

公開前に `contact@aiassetlab.jp` を確認します。

- メールアドレスが実在する
- 外部アドレスから受信できる
- 迷惑メールへ振り分けられない
- Footerの `mailto:contact@aiassetlab.jp` が正しい
- Privacy Policy / Termsの連絡先と一致している
- 返信元として利用できる

コード上の参照箇所は `components/layout/AppFooter.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx` です。

---

## OpenAI API Policy

初回Production公開では `OPENAI_API_KEY` を設定しません。Chat fallbackを正常仕様として公開可能とします。

コード上の確認事項:

- `OPENAI_API_KEY` 未設定時はOpenAIへfetchせず、fallback回答を200で返す
- fallback時も `source: "fallback"` を返す
- Chat UIはfallback時に「現在は簡易回答です。」を表示する
- catch時のログは最小限のerror messageのみで、APIキーやOpenAI response bodyを出さない

正式なAI回答を有効化する前の残タスク:

- OpenAI API利用枠の確認
- Billing設定
- 利用上限設定
- `OPENAI_MODEL` の最終判断
- エラー監視
- APIコスト監視
- OpenAI障害時もfallbackが継続することの確認

---

## Analytics and Verification Policy

- GA4は公開初日から有効化を推奨します。`NEXT_PUBLIC_GA_MEASUREMENT_ID` 設定時のみ読み込まれます。
- Microsoft Clarityは初回ユーザー行動を確認したい場合に公開初日から有効化できます。設定時のみ読み込まれます。
- Google Search Console verificationはProductionドメイン疎通後、早めに設定します。
- Version1.1ではCookieバナーを実装していません。計測サービスを有効化する前に、公開地域、利用目的、Privacy Policyの記載、運用判断を確認してください。

---

## Production Release Procedure

1. Vercel Production環境変数を設定する。
2. `NEXT_PUBLIC_SITE_URL` に `https://aiassetlab.jp` を設定する。
3. `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する。
4. 初回公開では `OPENAI_API_KEY` を設定しない。
5. GA4 / Clarity / Search Console verificationを有効化するか判断し、必要な環境変数を設定する。
6. Vercelで `aiassetlab.jp` と必要に応じて `www.aiassetlab.jp` を設定する。
7. DNSとSSLの状態を確認する。
8. `npm run build` を実行する。
9. Vercel Production deployを実行する。
10. `https://aiassetlab.jp` で疎通確認する。
11. TOP / Diagnosis / Portfolio / Dashboard / Chat / Simulator / Privacy / Terms / 404を確認する。
12. canonical / OGP / sitemap.xml / robots.txt / manifest.webmanifestを本番URLで再確認する。
13. Diagnosis結果遷移を確認する。
14. Portfolio登録・削除・Dashboard反映を確認し、テストデータを削除する。
15. Chat fallbackと「現在は簡易回答です。」表示を確認する。
16. `contact@aiassetlab.jp` の受信と返信元利用を確認する。
17. GA4 / Clarity / Search Consoleを有効化した場合は初回計測を確認する。

---

## Rollback Procedure

Production公開後に重大問題が見つかった場合は、次の順で対応します。

1. Vercelで直前の正常DeploymentをProductionへPromoteする。
2. 問題のあるDeploymentをProductionとして使い続けない。
3. 直近の環境変数変更を確認し、必要に応じて戻す。
4. Supabaseに意図しないデータ作成や破損がないか確認する。
5. 発生内容、影響範囲、暫定対応、恒久対応をドキュメントへ記録する。
6. 修正後はPreview QAを再実施してからProductionへ進める。
