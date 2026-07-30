# Auth and Portfolio Sync

Deployment Step10-A1で追加した認証・Portfolioクラウド同期基盤の設計です。Productionデプロイ、SQL適用、Google OAuth設定はまだ行っていません。

## Runtime Choice

- Next.js: `14.2.23`
- React: `18.3.1`
- Supabase packages: `@supabase/supabase-js`, `@supabase/ssr`
- Next.js 14では `middleware.ts` を使い、`proxy.ts` は採用しません。
- Session refreshは `middleware.ts` から `@supabase/ssr` の `createServerClient()` と `auth.getUser()` で行います。

## Auth Flow

1. `/login` でGoogle OAuthまたはEmail OTPを開始する。
2. Supabase Authが `/auth/callback` へ戻す。
3. callback routeが `code` を `exchangeCodeForSession()` でsessionへ交換する。
4. `next` は内部相対パスだけ許可し、未指定または不正値は `/dashboard` へ戻す。
5. `/auth/logout` がSupabase sessionを削除する。

token、OAuth code、Cookie、資産JSONはログへ出しません。

Redirect guard rejects:

- `//evil.example`
- `https://evil.example`
- encoded external URL
- backslash-based paths
- control characters

## Source of Truth

| State | Source of Truth | Cache |
| --- | --- | --- |
| Logged out | `localStorage` | none |
| Logged in and resolved | Supabase | user-hashed local cache |
| Logged in and migration pending | no automatic cloud upload | existing localStorage remains until user chooses |

Guest modeは維持します。`/`, `/diagnosis`, `/portfolio`, `/dashboard`, `/chat` はログイン必須にしません。

## Migration Decisions

| Local | Cloud | Decision |
| --- | --- | --- |
| 0 | 0 | empty portfolio |
| >0 | 0 | ask before uploading local assets |
| 0 | >0 | use cloud and update local cache |
| >0 | >0 and same fingerprint | use cloud, no duplicate migration |
| >0 | >0 and different fingerprint | conflict UI |

Conflict時は自動mergeしません。`この端末のデータで置き換える` は二段階確認にし、実行直前にcloudを再取得する設計です。
Step10-A2では、実行直前にcloud件数が変化していた場合は置き換えを停止し、選択をやり直す構成へ補強しました。

## Portfolio Assets

- Existing `PortfolioAsset.id` is `string`; DB id is also `text` and `(user_id, id)` primary keyにします。
- 金額はUI上の円整数を維持し、DBは `numeric(14, 0)` で保存します。
- `memo` は保持します。既存型にない項目は推測で追加しません。

## Portfolio Snapshots

- Existing storage key: `aiassetlab.portfolioSnapshots.v1`
- Cloud table stores typed `PortfolioSnapshot` in `jsonb`.
- Same `(user_id, fingerprint)` is unique.
- Maximum 5 snapshots is Step10-A1ではapplication logicで制御します。
- 同時更新時に一時的な競合が起きる可能性は残ります。必要なら後続StepでDB trigger化します。

## RLS

`portfolio_assets` と `portfolio_snapshots` はRLSを有効化し、全CRUDで `auth.uid() = user_id` を要求します。

- 未ログインユーザーはDB資産を取得できません。
- User AはUser Bの資産を取得できません。
- insert/updateで別ユーザーの `user_id` を指定できません。
- deleteは本人のみです。

## Logout Isolation

- Supabase sessionを削除します。
- cloud由来cacheと正式Portfolio localStorageを消し、次の未ログインユーザーへ前ユーザーの資産が見えないようにします。
- Cache keyにはメールアドレスを含めず、user idの短いhashを使います。

## Known Limits

- SQL migrationは未適用です。
- Google OAuthとSupabase URL Configurationは未設定です。
- RLSはSQLとして保存済みですが、実Project上の検証はStep10-A2で行います。
- アカウント削除UIは未実装です。auth user削除時は `on delete cascade` で資産・snapshotが削除される設計です。
- Supabase SSR middleware由来のEdge Runtime warningはbuild時に確認済みです。PreviewでRuntime error、OAuth loop、Cookie refresh failureが出る場合はNo-Goとして扱います。
