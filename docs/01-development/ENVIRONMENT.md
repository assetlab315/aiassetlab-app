# Development Environment

AI Asset Labのローカル開発・Preview検証で使う環境変数です。実値、APIキー、OAuth secret、Supabase service role keyは記録しません。

## Public Client Variables

| Name | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production required | Client / Server | canonical、OGP、OAuth callback確認で使う公開URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth/Sync required | Client / Server | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth/Sync required | Client / Server | Supabase anon key。RLS前提の公開可能key |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Client | GA4。Productionのみ設定 |
| `NEXT_PUBLIC_CLARITY_ID` | Optional | Client | Microsoft Clarity。現在未設定 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Server metadata | Search Console verification |

## Server-Only Variables

| Name | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | Optional | Server only | AI ChatをOpenAI応答へ切り替える場合に使用 |
| `OPENAI_MODEL` | Optional | Server only | AI Chatのモデル指定 |

## Supabase Auth and Sync

- Step10-A1では `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を正式採用します。
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` との混在はしません。
- Supabaseのservice role keyは今回使用しません。Client Component、browser bundle、`.env.example` へ記載しません。
- Supabase未設定でも `/`, `/portfolio`, `/dashboard`, `/login` はクラッシュせず、ゲスト利用を維持します。
- 環境変数をVercelへ追加または変更した場合、該当Environmentの再デプロイが必要です。

## OAuth Callback

- Local: `http://localhost:3000/auth/callback`
- Preview: Vercel Preview URLの `/auth/callback`
- Production: `https://aiassetlab.jp/auth/callback`
- callback URLはSupabase Authentication URL ConfigurationとGoogle Cloud OAuth Clientの両方で整合させます。
- Step10-A2のPreview検証では、まずPreview EnvironmentのみにSupabase public envを設定します。Production scopeには追加しません。
- Google OAuthのAuthorized redirect URIには、アプリの `/auth/callback` ではなく、Supabase Provider画面に表示されるSupabase Auth callback URLを登録します。
