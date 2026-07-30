# Supabase Setup Guide

Deployment Step10-A1のコードをPreviewまたはProductionで使う前に、人間がSupabaseとGoogle Cloud側で実施する手順です。秘密情報はCodexやGitへ貼り付けません。

## 1. Supabase Project

1. Supabase DashboardでAI Asset Lab用Projectを確認または作成する。
2. Project URLを取得する。
3. anon keyを取得する。
4. service role keyはアプリへ設定しない。
5. `supabase/migrations/20260728000000_create_portfolio_sync.sql` を確認する。
6. SQL EditorまたはSupabase CLIでmigrationを適用する。
7. `portfolio_assets` と `portfolio_snapshots` のRLSが有効であることを確認する。

## 2. Authentication URL Configuration

1. Site URLを対象Environmentに合わせて設定する。
2. Local callbackを追加する: `http://localhost:3000/auth/callback`
3. Vercel Preview callbackを追加する: `https://<preview-domain>/auth/callback`
4. Production callbackを追加する: `https://aiassetlab.jp/auth/callback`
5. `https://www.aiassetlab.jp/auth/callback` を使う場合は、非wwwへのリダイレクト方針と矛盾しないか確認する。

## 3. Google OAuth

1. Google Cloud ConsoleでOAuth Clientを作成する。
2. Authorized JavaScript originsへLocal、Preview、Production originを登録する。
3. Authorized redirect URIsへSupabaseが表示するGoogle provider callback URLを登録する。
4. Google Client IDとClient SecretをSupabase Authentication Providerへ設定する。
5. Google providerを有効化する。

## 4. Vercel Environment Variables

PreviewまたはProductionの対象Environmentだけに設定します。

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

設定後は再デプロイが必要です。本番OpenAIやAnalyticsの設定とは分けて判断します。

## 5. Preview QA

1. `/login` が表示される。
2. Googleログインが開始できる。
3. `/auth/callback` 後にDashboardへ戻る。
4. Guest資産2件からmigration確認が表示される。
5. `今回は保存しない` でcloudへ送信されない。
6. `アカウントへ保存` でcloudへ保存される。
7. Private Browserからログインし、cloud資産が表示される。
8. local 2件 / cloud 3件でconflict UIが出る。
9. 置き換えは二段階確認になる。
10. logout後に前ユーザー資産が見えない。
11. User AとUser BのRLS isolationを確認する。

## 6. RLS Verification

1. `scripts/verify-supabase-rls.sql` を開く。
2. `USER_A_UUID` と `USER_B_UUID` をPreview用テストユーザーのauth user idへ置き換える。
3. Service Role clientではなく、RLSが効くauthenticated contextまたは通常のSupabase clientで確認する。
4. `portfolio_assets` と `portfolio_snapshots` の `rowsecurity` がtrueであることを確認する。
5. policy一覧でSELECT / INSERT / UPDATE / DELETEが両テーブルに存在することを確認する。
6. User AからUser Bのinsert / select / update / deleteが拒否または0件になることを確認する。

## 7. Production前 Blockers

- SQL migration未適用
- Google OAuth未設定
- Supabase Redirect URL未設定
- RLS isolation未確認
- Preview OAuth未確認
- アカウント削除依頼運用未整理
- Email OTPの本番配信方針未整理。Supabase標準メールはPreview検証成功を本番配信保証として扱わない
