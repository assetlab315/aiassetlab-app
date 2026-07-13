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

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` が設定されている
- [ ] GA4でアクセス計測が開始されている
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` が設定されている
- [ ] Google Search Consoleで所有権確認が完了している
- [ ] `NEXT_PUBLIC_CLARITY_ID` が設定されている
- [ ] Microsoft Clarityでセッション計測が開始されている

---

## Domain

- [ ] 独自ドメインが本番環境に接続されている
- [ ] `NEXT_PUBLIC_SITE_URL` が公開URLに設定されている
- [ ] `https://aiassetlab.jp` をPrimary Domainに設定している
- [ ] `www.aiassetlab.jp` を追加する場合は非wwwへリダイレクトされる
- [ ] HTTPSでアクセスできる
- [ ] OGP画像、title、descriptionが共有時に表示される
- [ ] favicon / icon / apple-touch-icon が表示される
- [ ] `robots.txt` が公開向けになっている
- [ ] `sitemap.xml` に公開ページのURL漏れがない

---

## Legal

- [ ] Privacy Policyページを確認している
- [ ] Termsページを確認している
- [ ] FooterからPrivacy Policyへ移動できる
- [ ] FooterからTermsへ移動できる
- [ ] contactメールリンクが動作する
- [ ] `contact@aiassetlab.jp` が外部アドレスから受信できる
- [ ] `contact@aiassetlab.jp` が返信元として使用できる

---

## Release

- [x] `npm run build` が成功している
- [ ] VercelのNode.jsが20系で動作する
- [ ] Vercelに必要な環境変数を設定している
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
- [ ] Production公開前に `NEXT_PUBLIC_SITE_URL` が `https://aiassetlab.jp` であることを確認する
- [ ] Production公開前に独自ドメイン設定を確認する
- [ ] Production公開前に `contact@aiassetlab.jp` の受信確認を行う
- [ ] Production公開前にOpenAI API利用枠・請求設定の最終判断を行う
- [ ] Production公開前にGA4 / Clarity / Google Search Console verificationの設定判断を行う
- [ ] Productionデプロイ後Smoke Testを実施する
- [ ] release tagを作成する
- [ ] GitHub Releaseを作成する
- [ ] Vercel production deployを実行する
- [ ] production URLでTOP / Dashboard / Portfolio / Chat / Diagnosisを確認する
- [ ] production URLでcanonical / OGP / sitemap.xml / robots.txtを再確認する
- [ ] production URLでSupabase登録・削除テスト後、テストデータを削除する
- [ ] production URLでChat fallback表示を確認する
- [ ] 重大問題時のVercel rollback手順を確認している

---

## Post Release

- [ ] GA4で初回アクセスを確認する
- [ ] Search Consoleへsitemapを送信する
- [ ] Clarityで初回セッションを確認する
- [ ] 初回ユーザーとしてTOPからDiagnosis、Portfolio、Dashboard、AI Chatまで進める
- [ ] 問い合わせ導線、Legal導線、404 / 500相当画面を確認する
