# AI Asset Lab - Release Checklist

Version1.1公開前に確認する項目です。

---

## AI

- [x] 初回Production公開では `OPENAI_API_KEY` を設定しない方針を確認している
- [ ] OpenAI APIを有効化する場合の課金設定と利用上限を確認している
- [ ] OpenAI APIを有効化する場合、AI ChatがOpenAI APIで回答することを確認している
- [ ] OpenAI接続失敗時にfallback回答へ切り替わることを確認している
- [ ] 本番ログにAPIキーやOpenAI response bodyが出ないことを確認している

---

## Analytics

- [x] 初回Production公開ではGA4を未設定にする方針を確認している
- [x] 初回Production公開ではMicrosoft Clarityを未設定にする方針を確認している
- [x] GA4はProduction限定ガードを通して読み込む方針を確認している
- [ ] GA4はProduction環境だけにIDを設定する
- [ ] GA4 Enhanced Measurementのブラウザ履歴イベント設定を確認する
- [ ] GA4 Realtime / DebugViewで初回表示とページ遷移を確認する
- [ ] GA4で二重page_viewがないことを確認する
- [ ] Microsoft ClarityはProduction安定確認後の別Sprintで導入判断する
- [ ] Clarity導入前に資産情報とAI相談内容のマスキング方針を確認する
- [x] Google Search Console URLプレフィックス方式のverificationが完了している
- [x] Google Search Consoleへsitemap.xmlを送信し、成功を確認している

---

## Domain

- [x] 独自ドメインが本番環境に接続されている
- [x] `NEXT_PUBLIC_SITE_URL` が公開URLに設定されている
- [x] `https://aiassetlab.jp` をPrimary Domainに設定している
- [x] `www.aiassetlab.jp` を追加する場合は非wwwへリダイレクトされる
- [x] HTTPSでアクセスできる
- [x] OGP画像、title、descriptionが共有時に表示される
- [x] favicon / icon / apple-touch-icon が表示される
- [x] `robots.txt` が公開向けになっている
- [x] `sitemap.xml` に公開ページのURL漏れがない

---

## Legal

- [x] Privacy Policyページを確認している
- [x] Termsページを確認している
- [x] FooterからPrivacy Policyへ移動できる
- [x] FooterからTermsへ移動できる
- [x] contactメールリンクが動作する
- [x] `contact@aiassetlab.jp` が外部アドレスから受信できる
- [x] `contact@aiassetlab.jp` が返信元として使用できる

---

## Release

- [x] `npm run build` が成功している
- [ ] VercelのNode.jsが20系で動作する
- [x] Vercelに必要な環境変数を設定している
- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_URL` を設定している
- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定している
- [x] Vercel Production環境に `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` を設定している
- [x] Production環境変数変更後に再デプロイが必要なことを確認している
- [x] Preview Protectionを解除する、またはQA可能な共有URLを用意する
- [x] Shareable Preview URLでSSOに止まらずアプリ本体へ到達できる
- [x] Vercel Preview URLでTOP / Diagnosis / Portfolio / Dashboard / Chat / Simulator / Privacy / Terms / 404をHTTP応答で確認する
- [x] Vercel Preview URLでsitemap.xml / robots.txt / manifest.webmanifestを確認する
- [x] Vercel Preview URLでChat fallback APIが200で返ることを確認する
- [x] Vercel Preview URLでConsole errorとNetwork errorを確認する
- [x] Vercel Preview URLでPortfolio登録・削除・Dashboard反映を確認する
- [x] Vercel Preview URLでDiagnosis結果遷移とChat fallback表示を確認する
- [x] Vercel Preview URLでSimulator入力と結果表示を確認する
- [x] Vercel Preview URLで375px前後のモバイル表示を確認する
- [x] Production公開前に `NEXT_PUBLIC_SITE_URL` が `https://aiassetlab.jp` であることを確認する
- [x] Production公開前に独自ドメイン設定を確認する
- [x] Production公開前に `contact@aiassetlab.jp` の受信確認を行う
- [ ] Production公開前にOpenAI API利用枠・請求設定の最終判断を行う
- [ ] Production公開前にGA4 / Clarity / Google Search Console verificationの設定判断を行う
- [x] Production公開前にGA4 / Clarityを未設定にする方針を確認している
- [ ] Search Console verificationは独自ドメイン疎通後に設定する
- [ ] Productionデプロイ後Smoke Testを実施する
- [ ] release tagを作成する
- [ ] GitHub Releaseを作成する
- [x] Vercel production deployを実行する
- [x] production URLでTOP / Dashboard / Portfolio / Chat / Diagnosisを確認する
- [x] production URLでcanonical / OGP / sitemap.xml / robots.txtを再確認する
- [x] Productionデプロイ後に `robots.txt`, `sitemap.xml`, `manifest.webmanifest` の404が解消されていることを確認する
- [x] production URLでSupabase登録・削除テスト後、テストデータを削除する
- [x] production URLでChat fallback表示を確認する
- [x] 重大問題時のVercel rollback手順を確認している

---

## Post Release

- [ ] GA4導入後に初回アクセスを確認する
- [x] Search Consoleへsitemapを送信する
- [ ] Clarityで初回セッションを確認する
- [ ] 初回ユーザーとしてTOPからDiagnosis、Portfolio、Dashboard、AI Chatまで進める
- [ ] 問い合わせ導線、Legal導線、404 / 500相当画面を確認する
