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
- [x] Step7-CでPortfolio SummaryではなくPortfolio InsightsをAIへ渡す構成を実装している
- [x] Portfolio Insightsにカテゴリ比率、集中度、分散状態、warnings / strengths / recommendationsを含めている
- [x] 資産未登録時は「資産情報未登録」のみAIへ渡す構成を確認している
- [x] Step7-C Production Smoke TestがNo-Goだったことを記録している
- [x] ChatClientが実際のPortfolio保存キーを読めていなかった原因を修正している
- [x] `npm run test:portfolio-context` で最終promptとOpenAI messagesへのInsights deliveryを確認している
- [x] Step7-C.2でPortfolio Insightsを回答へ最低1点以上反映するprompt制御を追加している
- [x] Step7-C.2で新NISAの固定知識ガードを追加している
- [x] `npm run test:portfolio-context` でNISA固定知識と旧制度年額を含めないことを確認している
- [x] Step8-AでDashboardが `PortfolioInsights` を再利用するAI Insight Cardを実装している
- [x] Dashboard InsightはOpenAI APIを呼ばず、ローカル分析だけで生成している
- [x] `npm run test:dashboard-insights` で資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好、積立未設定を確認している
- [x] Step8-A Production Smoke Testを完了扱いとして記録している
- [x] Step8-BでDashboardにExplainable Asset Health Scoreを実装している
- [x] Asset Health ScoreはOpenAI APIを呼ばず、Portfolio Insightsから決定論的に生成している
- [x] Asset Health Scoreは資産配分と積立状況を基にした参考指標であり、投資成果予測ではないことを表示している
- [x] `npm run test:asset-health-score` でscore、grade、factor、improvementPotential、Today Action整合性を確認している
- [x] Step8-B Production Smoke Testを完了扱いとして記録している
- [x] Step9-AでPortfolio Change Trackingを実装している
- [x] Portfolio snapshotはlocalStorageのみへ最大5件保存し、同一fingerprintの重複保存を防止している
- [x] 比較対象は「前回の異なる記録」であり、厳密な月次・日次比較として表示しない
- [x] `npm run test:portfolio-change` でsnapshot、storage、comparison、summary主要シナリオを確認している
- [x] Step9-A Production Smoke Testを完了扱いとして記録している
- [x] Step9-A.1で新規ブラウザにデモ資産2件が自動表示される問題を修正している
- [x] Portfolio keyなし、不正JSON、空配列では `loadPortfolioAssets()` が空配列を返す
- [x] Portfolio初回表示時にデモ資産や空配列を自動保存しない
- [x] Production UIから `デモ状態に戻す` ボタンを削除している
- [x] `npm run test:no-demo-seeding` で自動デモ投入停止を確認している
- [x] Step9-BでDashboardにAI Portfolio Reviewを実装している
- [x] AIレビューはOpenAI APIを呼ばず、既存のPortfolio / Dashboard / Health / Change分析結果だけで生成している
- [x] AIレビューのhighlightは最大3件、summaryは1〜2文、next actionは1件に制御している
- [x] `npm run test:portfolio-review` でToday Action、AI Insight、Asset Healthとの整合性を確認している
- [x] Step10-A1でSupabase Auth / Google OAuth開始 / Email OTP基盤 / callback / logout / Account画面を追加している
- [x] Step10-A1でPortfolio Cloud Sync Repository、migration確認、conflict選択、二段階overwrite確認を追加している
- [x] Step10-A1で `portfolio_assets` / `portfolio_snapshots` のRLS付きSQL migrationを作成している
- [x] Step10-A1でService Role Keyを使用しない構成を確認している
- [x] `npm run test:auth-foundation` / `npm run test:portfolio-sync` を追加している
- [ ] Step7-B反映後にProduction再デプロイを実施している
- [ ] Step7-B反映後に新NISA、資産未登録、情報不足、危険相談、個別銘柄、機密情報のSmoke Testを実施している
- [ ] Step7-C反映後に現金90% / 株式10%、暗号資産70%、1銘柄100%、資産なしのSmoke Testを実施している
- [ ] Step7-C.1反映後に同じNo-Go 3ケースをProductionで再テストしている
- [ ] Step7-C.2反映後にNISA質問で旧制度年額が出ないことをProductionで確認している
- [ ] Step8-A反映後にDashboardで資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好のInsight CardをProductionで確認している
- [ ] Step8-B反映後にDashboardで資産未登録、現金偏重、暗号資産偏重、単一資産集中、分散良好・積立あり / なしのAsset HealthをProductionで確認している
- [ ] Step9-A反映後にPortfolio Change Trackingの履歴なし、積立開始、積立停止、暗号資産集中発生、単一資産集中解消、mixed、小さな変化、同一内容再保存、全資産削除、不正localStorageをProductionで確認している
- [ ] Step9-A.1反映後にFirefox Private / Chrome IncognitoでPortfolioが0件から開始し、デモ資産2件が自動保存されないことを確認している
- [ ] Step9-B反映後にAIレビューのno assets、no history、improved、mixed、needs_attention、no_changeをProductionで確認している
- [ ] Step10-A2でSupabase SQL migrationを実Projectへ適用している
- [ ] Step10-A2でGoogle OAuth Providerとcallback URLを設定している
- [ ] Step10-A2でPreview login / callback / migration / conflict / logoutを確認している
- [ ] Step10-A2でRLS isolationをUser A / User Bで確認している
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
