# AI Asset Lab - Release Checklist

Version1.1公開前に確認する項目です。

---

## AI

- [x] 初回Production公開では `OPENAI_API_KEY` を設定しない方針を確認している
- [x] APIキー設定前にChat APIの入力制限、出力上限、timeout、fallback整合性を実装している
- [x] APIキー設定前にbest-effort rate limitを実装している
- [x] Chat画面にAI回答は参考情報であり機密情報を入力しない旨を表示している
- [x] Privacy Policyに外部AIサービス利用時の送信情報と機密情報入力禁止を明記している
- [x] rate limitはServerless複数インスタンス間で完全共有されない制約をRunbookに記録している
- [x] OpenAI Billingが有効であることを確認している
- [x] 初回クレジット5 USD、Auto recharge OFFを確認している
- [x] Production用OpenAI API keyを設定している
- [x] Vercel Production環境に `OPENAI_API_KEY` を設定している
- [x] Vercel Production環境に `OPENAI_MODEL=gpt-4o-mini` を設定している
- [x] OpenAI環境変数設定後にProduction再デプロイを実施している
- [x] AI ChatがProductionでOpenAI API回答を返すことを確認している
- [x] Step7-A commit `f155569` がProduction反映済みであることを確認している
- [x] Step7-BでAI回答品質改善promptを実装している
- [ ] Step7-B反映後にProduction再デプロイを実施している
- [ ] Step7-B反映後に新NISA、資産未登録、情報不足、危険相談、個別銘柄、機密情報のSmoke Testを実施している
- [ ] OpenAI接続失敗時にfallback回答へ切り替わることを確認している
- [ ] 本番ログにAPIキーやOpenAI response bodyが出ないことを確認している

---

## Analytics

- [x] 初回Production公開時点ではGA4を未設定にする方針を確認している
- [x] 初回Production公開時点ではMicrosoft Clarityを未設定にする方針を確認している
- [x] GA4はProduction限定ガードを通して読み込む方針を確認している
- [x] GA4 Measurement IDを取得している
- [x] GA4はProduction環境だけにIDを設定する
- [x] GA4はPreview / DevelopmentにIDを設定していない
- [x] GA4 Enhanced Measurementのブラウザ履歴イベント設定を確認する
- [x] GA4 Realtimeで初回表示とページ遷移を確認する
- [x] GA4で二重page_viewがないことを確認する
- [x] Privacy Policy更新済み
- [x] Microsoft Clarityは未導入として後続Sprintへ分離している
- [ ] Microsoft Clarityはマスキング方針確定後の別Sprintで導入判断する
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
- [x] Production公開前にGA4 / Clarity / Google Search Console verificationの設定判断を行う
- [x] Production公開時点ではGA4 / Clarityを未設定にする方針を確認している
- [x] Search Console verificationは独自ドメイン疎通後に設定する
- [x] Productionデプロイ後Smoke Testを実施する
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

- [x] GA4導入後に初回アクセスを確認する
- [x] Search Consoleへsitemapを送信する
- [ ] Clarityで初回セッションを確認する
- [ ] 初回ユーザーとしてTOPからDiagnosis、Portfolio、Dashboard、AI Chatまで進める
- [ ] 問い合わせ導線、Legal導線、404 / 500相当画面を確認する
