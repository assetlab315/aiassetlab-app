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

初回Production公開では `OPENAI_API_KEY` を設定せず、Chat fallbackを正常仕様として公開しました。2026-07-27時点でOpenAI Billingは有効、初回クレジット5 USD、Auto recharge OFF、Production API key設定済み、`OPENAI_MODEL=gpt-4o-mini`、本番AI応答確認済みです。APIキー値、カード情報、秘密情報は記録しません。

コード上の確認事項:

- `OPENAI_API_KEY` 未設定時はOpenAIへfetchせず、fallback回答を200で返す
- fallback時も `source: "fallback"` を返す
- Chat UIはfallback時に「現在は簡易回答です。」を表示する
- catch時のログは最小限のerror messageのみで、APIキーやOpenAI response bodyを出さない
- messageは最大1,000文字、historyは最大6件、portfolio文脈は最大8件に制限する
- OpenAI Chat Completions APIの出力は `max_tokens: 500` に制限する
- OpenAI通信は15秒でtimeoutし、timeout時はfallback回答へ切り替える
- OpenAI non-OK、timeout、invalid JSON、malformed responseは安全な分類ログのみを残し、本文・資産情報・APIキーはログへ出さない
- OpenAI responseに有効な回答がない場合は `source: "fallback"` を返す
- Chat APIは10分10回のIP単位best-effort in-memory rate limitを持つ
- AI回答は結論を先に示し、一般論だけで終わらせず、具体的な選択肢と次にやることを1つ示す
- Portfolio-aware回答では、個別資産一覧ではなく分析済みPortfolio InsightsをAIへ渡す
- Portfolio Insightsは総資産、カテゴリ比率、集中度、分散状態、現金/株式系/暗号資産の状態、warnings / strengths / recommendationsを含む
- AIはPortfolio Insightsを質問と関係ある場合のみ自然に使い、数値一覧を読み上げない
- 資産未登録時はInsightsを生成せず、「資産情報未登録」のみ渡す
- 新NISA相談では、つみたて投資枠、低コストの分散型インデックス、全世界株式型と米国株式型の違い、生活防衛資金、元本保証ではない点を扱う
- 借入投資、生活費の全額投資、損失回復目的の追加投資は後押ししない
- 個別銘柄の上昇や売買を断定しない
- パスワード、秘密鍵、カード番号などの機密情報は再掲しない

Rate limitの制約:

- 現在のrate limitはmodule scopeのMapを使うbest-effort実装です。
- Vercel Serverlessでは複数インスタンス間でMapが完全共有されないため、完全な濫用防止ではありません。
- Mapは古いentryの削除と最大件数制限でメモリ肥大化を抑えます。
- OpenAI APIを有効化する場合は、OpenAI Platform側のBudget / Usage Limit / Usage Alertと併用してください。
- 利用増加時は永続ストア型rate limitの導入を検討します。

正式なAI回答を有効化する前の残タスク:

- OpenAI API利用枠の継続確認
- Billing残高とAuto recharge OFFの継続確認
- 低い月額BudgetとUsage Alert設定の継続確認
- Production API keyの安全な管理
- Vercel Production環境変数 `OPENAI_API_KEY` の安全な管理
- `OPENAI_MODEL` の最終判断
- Step7-B反映後のProduction再デプロイ
- Step7-B反映後の本来AI応答Smoke Test
- エラー監視
- APIコスト監視
- OpenAI障害時もfallbackが継続することの確認

Step7-B反映後のSmoke Test:

- 新NISA初心者: つみたて投資枠、分散型インデックス、全世界株式型と米国株式型、生活防衛資金、次の行動が含まれる
- 資産未登録: 配分判断には登録が必要と説明し、一般的な確認観点も示す
- 情報不足: 答えられる範囲を先に示し、追加質問は最大1つ
- 危険な相談: 借入投資を推奨せず、安全な代替行動を示す
- 個別銘柄: 上昇を断定せず、判断材料と分散を示す
- 会話継続: 直近履歴を踏まえ、同じ説明を繰り返しすぎない
- 機密情報: パスワード等を再掲せず、入力しないよう伝える
- Portfolio-aware: 現金90% / 株式10%、暗号資産70%、1銘柄100%、資産なしの4ケースを確認する
- Runtime LogsにAPIキー、Authorization header、相談本文、資産情報、OpenAI response body全文が出ないことを確認する

### Step7-C.1 Portfolio Context Delivery Fix

Step7-C Production Smoke TestはNo-Goでした。資産未登録、現金90% / 株式10%、暗号資産70%の3ケースでPortfolio-aware回答が反映されませんでした。

原因:

- Portfolioの実保存キーは `aiassetlab_portfolio_assets_v1`
- ChatClientは古い候補キーだけを読んでおり、実際のPortfolioデータを `/api/chat` へ送れていませんでした

修正後の確認:

- `npm run test:portfolio-context` で、資産なし、現金90% / 株式10%、暗号資産70%、1資産100%の最終promptを確認する
- OpenAI messagesのuser contentに `Portfolio Insights:` が含まれることを確認する
- Production再反映後、同じ3ケースでSmoke Testを再実施する

### Step7-C.2 Portfolio Insight Enforcement & Financial Fact Guard

- Portfolio分析を求める質問では、Portfolio Insightsがある場合に最低1点以上回答へ反映する
- 資産情報未登録の場合は、冒頭2文以内に具体的な資産配分分析ができないことを明示する
- Warningsがある場合、質問に関係するwarningを最低1つ反映する
- 登録済みportfolioがある場合に「まず現在の資産を確認してください」で終わらせない
- 新NISAは固定知識を優先し、つみたて投資枠 年120万円、成長投資枠 年240万円、生涯非課税保有限度額 1800万円を案内する
- 旧つみたてNISAの年額上限を現行制度として案内しない
- Production反映後、NISA質問で旧制度年額が出ないことを確認する

### Step8-A AI Dashboard Insights

- Dashboardの `AI Insight` はOpenAI APIを呼ばず、登録済みPortfolioから生成した `PortfolioInsights` を再利用する
- 経路は `loadPortfolioAssets()` → `createPortfolioInsights()` → `createDashboardInsights()` → `DashboardInsightCard`
- Dashboard側で独自のPortfolio集計を増やさない
- hydration前は未登録Insightを表示せず、読み込み中skeletonを表示する
- CTAは最大1つとし、存在するPortfolioまたはSimulator画面へ限定する

Step8-A反映後のSmoke Test:

- 資産未登録: 「まだ資産情報が登録されていません」とPortfolio登録CTAが表示される
- 現金偏重: 現金の良い面と長期資産形成の注意点が表示され、売買を断定しない
- 暗号資産偏重: 価格変動・集中の注意と分散型資産を優先するToday Actionが表示される
- 単一資産集中: 1資産集中の注意と次の積立先で分散するToday Actionが表示される
- 分散良好: 不要な変更を勧めず、無理のない積立継続が表示される
- 375px前後のMobileでカード、CTA、折り返し、Dashboard既存カードとの余白を確認する
- Light / Dark modeで文字の可読性とFocus表示を確認する

### Step8-B Explainable Asset Health Score

- Dashboardの `Asset Health` はOpenAI APIを呼ばず、`PortfolioInsights` から決定論的に生成する
- 経路は `loadPortfolioAssets()` → `createPortfolioInsights()` → `createAssetHealthScore()` → `AssetHealthScoreCard`
- scoreは基準点60からfactor impactで加減し、0〜100にclampする
- gradeは A: 85〜100、B: 70〜84、C: 50〜69、D: 0〜49
- 資産未登録時は `score: null` / `grade: null` とし、スコア未算出で表示する
- improvementPotentialは `100 - score` ではなくnegative factorの絶対値合計で表示する
- 単一資産集中、暗号資産偏重、現金偏重、特定資産集中は同一原因の二重減点を避ける
- スコアは資産配分と積立状況を基にした参考指標であり、投資成果予測ではない

Step8-B反映後のSmoke Test:

- 資産未登録: スコア未算出、gradeなし、Insight CardとのCTA重複が過剰でない
- 現金90% / 株式10% / 積立なし: 現金偏重と積立未設定が主な改善理由として表示される
- 現金90% / 株式10% / 積立あり: 積立ありでスコアが上がり、暗号資産減点がない
- 暗号資産70% / 現金30%: 暗号資産集中が主な改善理由となり、同一原因で特定資産集中を重複表示しない
- 単一株式100%: 単一資産集中が大きめの改善理由となり、暗号資産・現金偏重の誤減点がない
- 分散良好・積立あり: AまたはB gradeで、100点固定にならず、不要な改善理由がない
- 分散良好・積立なし: 積立未設定が主な改善理由となり、分散の良い点は維持される
- Dashboard InsightのToday ActionとHealth Scoreの最大negative factorが大きく矛盾しない
- Mobile / Desktop / Light / Dark modeでscore、factor、改善余地の折り返しと可読性を確認する

### Step9-A Portfolio Change Tracking

- Portfolio snapshotは `aiassetlab.portfolioSnapshots.v1` に保存する
- snapshotは最大5件。同一fingerprintのsnapshotは重複保存しない
- snapshotは `PortfolioInsights` と `AssetHealthScore` を再利用し、Dashboard側で独自集計を増やさない
- 比較対象は現在状態と前回の異なるsnapshot
- 初回導入時は現在状態をbaselineとして保存し、Dashboardでは「比較できる記録はまだありません」と表示する
- empty portfolio snapshotは保存せず、全資産削除時は資産未登録状態を優先する
- snapshotはlocalStorageのみ。複数端末同期はなく、ブラウザデータ削除で履歴は消える
- 「先月比」「前月」「昨日」など厳密な期間比較に見える表現は使わない
- 登録資産総額の差を運用益、市場変動、入出金理由として断定しない
- 不正JSON、version不一致、NaN / Infinity相当、重複categoryなどの壊れたsnapshotは無視し、Dashboardをクラッシュさせない
- 将来DB履歴へ移行する場合も、snapshot versionとfingerprintを維持できる形にする

Step9-A反映後のSmoke Test:

- 既存ユーザーでsnapshot履歴なし: 初回baselineが作成され、履歴なし表示になる
- 積立開始: Health Score上昇と「毎月の積立を開始」が表示される
- 積立停止: 注意寄りの表示になり、「毎月の積立が停止」が表示される
- 暗号資産集中の新規発生: 暗号資産への偏りとHealth Score低下が表示され、売却指示は出ない
- 単一資産集中の解消: 分散が進んだこととHealth Score上昇が表示される
- 小さな配分変化: 大きな変化なしとして表示される
- 同一Portfolio再保存: snapshot件数が増えず、不要な変化が出ない
- asset削除、全asset削除、再登録で不自然なHealth Score急落・急上昇表示が出ない
- Dashboard再訪、ブラウザ再起動後も比較が維持される
- invalid localStorage時にDashboard / Portfolioがクラッシュしない
- Mobile 375px、Desktop、Light / Darkでscore delta、日付、change itemの折り返しを確認する
- AI Insight、Asset Health、Today Actionと内容が矛盾しない
- 画面文言にfalseな「先月比」「運用益」断定がない

### Step9-A.1 Remove Automatic Demo Portfolio Seeding

- Portfolio本体の正式keyは `aiassetlab_portfolio_assets_v1`
- keyなし、空文字、不正JSONでは `loadPortfolioAssets()` は空配列を返す
- keyなし時にPortfolio本体やsnapshotへデモ資産・空配列を自動保存しない
- 正常な既存資産配列は維持する
- 不正asset schemaは有効assetのみ読み込む
- 資産0件ではStep9-A baseline snapshotを作成しない
- Production UIに `デモ状態に戻す` ボタンを表示しない
- 既存ユーザーのlocalStorage資産やsnapshot履歴を自動削除しない

Step9-A.1反映後のSmoke Test:

- Firefox Privateで `https://aiassetlab.jp/portfolio` を開き、登録資産0件を確認する
- Firefox Privateで `https://aiassetlab.jp/dashboard` を開き、Dashboard empty stateを確認する
- DashboardでAsset Health Scoreが算出表示されないことを確認する
- Portfolio Change Cardが誤比較を表示しないことを確認する
- localStorageにデモ資産2件が保存されていないことを確認する
- 資産を1件追加し、追加した1件だけが表示されることを確認する
- リロード後も資産1件のままで、デモ資産が混ざらないことを確認する
- Dashboardでbaseline / no_history表示を確認する
- 通常ブラウザの既存資産が削除されず維持されていることを確認する
- 可能な範囲でChrome Incognito、Safari Privateでも同じ確認を行う

### Step9-B AI Portfolio Review

- Dashboardの `AIレビュー` はOpenAI APIを呼ばず、既存のローカル分析結果だけで生成する
- 経路は `PortfolioInsights` → `DashboardInsights` → `AssetHealthScore` → `DashboardChangeSummary` → `createPortfolioReview()` → `PortfolioReviewCard`
- summaryは1〜2文、highlightは最大3件、next actionは1件
- next actionはDashboardのToday Actionと矛盾させない
- AI Insightが暗号資産偏重や現金偏重を示している場合、Reviewで反対の総評を出さない
- Health Scoreが低い場合、Reviewで非常に健全と見える表現を出さない
- レビュー文では強い断定、売買指示、利益を想起させる表現を避ける

Step9-B反映後のSmoke Test:

- 資産0件: 「資産が登録されると、レビューを表示します」系のempty reviewが表示される
- no history: 現在のPortfolioを基準に次回から変化をレビューする旨が表示される
- improved: 積立開始や分散改善が良い変化として表示される
- mixed: 改善点と確認点が同時に表示され、scoreだけで改善と断定しない
- needs_attention: 配分の偏りと次の分散行動が表示される
- no_change: 大きな変化なしと継続確認が表示される
- highlightが最大3件で、Mobile 375pxでも横スクロールや文字切れがない
- AI Insight、Asset Health、Portfolio Change、Today Actionと内容が矛盾しない
- OpenAI APIや `/api/chat` が呼ばれていないことをNetworkまたはRuntime Logsで確認する

---

## Analytics and Verification Policy

### Step10-A1 Supabase Auth and Portfolio Sync

- Productionデプロイは未実行
- Supabase SQL migrationは未適用
- Google OAuth Providerは未設定
- Auth callbackは `/auth/callback`、logoutは `/auth/logout`
- Next.js 14.2.23では `middleware.ts` を使い、`proxy.ts` は使わない
- Session refreshは `@supabase/ssr` のserver clientとmiddlewareで行う
- 未ログインユーザーは従来どおりlocalStorageで利用可能
- ログイン済みでmigration解決後はSupabaseをSource of Truthにする
- local資産を確認なしでcloudへuploadしない
- cloud資産を確認なしでlocal資産でoverwriteしない
- logout時はcloud由来cacheと正式Portfolio localStorageを消し、次の未ログインユーザーに前ユーザー資産を見せない

Step10-A2で人間が実施すること:

1. Supabase Projectを確認または作成する
2. `supabase/migrations/20260728000000_create_portfolio_sync.sql` を適用する
3. RLS isolationをUser A / User Bで確認する
4. Supabase Authentication URL ConfigurationへLocal / Preview / Production callbackを登録する
5. Google Cloud OAuth Clientを作成し、Supabase Google ProviderへClient ID / Secretを設定する
6. Vercel Previewへ `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する
7. Previewでlogin、callback、migration、conflict、logoutをSmoke Testする

Step10-A2 Codex-side hardening:

- Auth redirect guardでexternal URL、protocol-relative URL、encoded external URL、backslash、control characterを拒否
- `/account` はSupabase設定済みかつ未ログイン時に `/login?next=/account` へredirect
- overwriteは保存直前にcloud件数を再取得し、変化があれば停止
- Portfolio同期UIに `aria-live` と保存中button disabledを追加
- RLS検証用 `scripts/verify-supabase-rls.sql` を追加
- build warning全文:
  `./node_modules/@supabase/supabase-js/dist/index.mjs A Node.js API is used (process.version at line: 27) which is not supported in the Edge Runtime. Import trace: @supabase/ssr -> lib/supabase/middleware.ts`
- 現時点の判断: build時warning。compile、type check、static generationは成功。Previewでmiddleware runtime error、OAuth loop、Cookie refresh failureが出る場合は修正必須

Step10-A2.1 Portfolio migration fix Preview Smoke Test:

1. Previewで未ログイン状態にする
2. `/portfolio` で資産を2〜3件登録する
3. HeaderのログインからGoogle OAuthを開始する
4. callback後に `/portfolio` へ戻ることを確認する
5. `[portfolio-sync] auth user resolved`、`local load completed`、`cloud fetch completed`、`migration decision`、`migration modal opened` がConsoleに出ることを確認する
6. local > 0 / cloud = 0 で移行確認UIが表示されることを確認する
7. `アカウントへ保存` で `upload started`、`upload succeeded`、`refetch succeeded` が出ることを確認する
8. Supabase `portfolio_assets` に対象userの行が作成されることを確認する
9. reload / logout / reloginでcloud assetsが復元されることを確認する
10. upload失敗時は `保存できませんでした` 系の表示になり、画面のlocal assetsが消えないことを確認する

- GA4は既存プロパティ「AI Asset Lab」と既存Web Streamを利用します。
- GA4 Web Stream URLは `https://aiassetlab.jp`、Stream IDは `15218177688`、Measurement IDは `G-BB1DMLMD15` です。
- GA4 Enhanced Measurementとページビュー計測は有効です。
- Vercel Production環境だけに `NEXT_PUBLIC_GA_MEASUREMENT_ID` を設定します。Preview / Developmentには設定しません。
- GA4はコード側でもProduction環境のみ読み込むガードを持ちます。
- GA4 Measurement ID設定後はProduction再デプロイを行います。
- Production再デプロイ後、Realtimeで初回ページ `AI資産形成診断の入口` のpage_viewを確認済みです。
- App Routerのクライアント遷移後、`資産形成Dashboard` が別のpage_viewとして1回計測されることを確認済みです。
- 今回の確認範囲では二重 `page_view` は発生していません。
- 計測漏れまたは二重計測が確認された場合のみ、専用Client Componentで明示的な `page_view` 送信を検討します。その場合は自動計測との二重計測を避けます。
- 将来的なGA4カスタムイベント候補は、診断開始、診断完了、資産登録、Dashboard表示、AI相談開始、シミュレーター利用です。
- Microsoft ClarityはGA4とは分離し、後続Sprintで導入判断します。Privacy Policy更新、機微情報のマスキング確認、本番導入前の限定的確認、ConsentおよびCookie運用の再確認を先に行います。
- Clarity導入時は、AI相談内容や資産情報を無条件に録画しない方針です。
- Google Search Console URLプレフィックスプロパティ `https://aiassetlab.jp/` は利用可能です。
- `https://aiassetlab.jp/sitemap.xml` は送信済みです。初回は「取得できませんでした」と表示されましたが、コードやDNSを変更せず待機し、その後「成功しました」へ変更されました。サイトマップ登録は完了扱いです。
- ドメインプロパティ追加は現段階では必須ではありません。
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` は、将来HTMLタグ方式など別方式を利用する場合の任意設定です。
- Version1.1ではCookieバナーを実装していません。計測サービスを有効化する前に、公開地域、利用目的、Privacy Policyの記載、運用判断を確認してください。

### Clarity Masking Policy

Clarityは導入前にマスキング方針を確認します。まずClarity管理画面側の設定を優先し、不十分な場合のみコード側で `data-clarity-mask` などの属性追加を検討します。

マスキング候補:

- 資産名
- 資産金額
- 毎月の積立額
- 資産メモ
- AI相談の入力内容
- AIの回答内容
- 診断回答
- 診断結果
- その他、個人の資産状況を推測できる情報

---

## Production Monitoring

新しい外部監視サービスは追加せず、現フェーズでは以下を最小構成とします。

### Release Time

- Vercel Deployment status
- Vercel Runtime Logs
- robots.txt / sitemap.xml / manifest.webmanifest の200確認
- 独自ドメイン、SSL、DNS
- Production URLの主要導線
- `/api/chat` fallback動作
- Supabase保存・取得
- `contact@aiassetlab.jp` の受信

### Daily

- Vercel Runtime Logsの重大error
- `/api/chat` のエラーまたはfallback増加
- Supabase関連の保存・取得エラー
- 問い合わせメール受信

### Weekly

- Search Consoleのsitemap状態
- Search Consoleのインデックス状況
- 404傾向
- robots.txt / sitemap.xml / manifest.webmanifest の200確認
- GA4でアクセスが継続していること
- GA4で主要ページのpage_viewが取得できていること
- GA4上の急激な計測停止または異常増加
- GA4確認は自分のテストアクセスだけで判断しないこと
- Clarity導入後の異常セッション

---

## Deployment Step 4 Manual Setup Checklist

Productionデプロイ前に、Vercel / DNS / メール管理画面で人間が確認する項目です。

- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_URL` を設定する
- [x] Vercel Production環境に `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する
- [x] Vercel Production環境に `NEXT_PUBLIC_SITE_URL=https://aiassetlab.jp` を設定する
- [ ] `OPENAI_API_KEY` と `OPENAI_MODEL` をProductionへ設定しない
- [ ] GA4 / Clarityは未設定のままにする
- [ ] Search Console verificationは独自ドメイン疎通後に設定する
- [x] `aiassetlab.jp` をVercel Domainsへ追加する
- [x] 必要に応じて `www.aiassetlab.jp` をVercel Domainsへ追加する
- [x] `https://aiassetlab.jp` をPrimary Domainに設定する
- [x] Vercel Dashboardに表示されたDNS設定をDNS管理画面へ反映する
- [x] DNS検証状態を確認する
- [x] SSL Certificate状態を確認する
- [ ] Production Deploymentへ独自ドメインが割り当てられることを確認する
- [x] Preview ProtectionがProductionドメインを遮断しないことを確認する
- [ ] `contact@aiassetlab.jp` のメールボックスまたは転送先を確認する
- [ ] 外部アドレスからテストメールを送信し、受信と返信を確認する

Production環境変数を変更した後は、Production Deploymentの再デプロイが必要です。今回はProductionデプロイを実行しません。

### Deployment Step 4 Result

2026-07-13時点で、Vercel Production環境と独自ドメイン設定は以下の状態です。

- `aiassetlab.jp`: Valid Configuration
- `www.aiassetlab.jp`: Valid Configuration
- SSL Certificate: 発行完了
- `https://aiassetlab.jp`: 表示確認OK
- `https://www.aiassetlab.jp`: 表示確認OK
- Vercel Authenticationによるブロックなし
- Production環境変数 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` は設定済み
- `www.aiassetlab.jp` から `https://aiassetlab.jp` への308 Permanent Redirectを確認済み
- `www.aiassetlab.jp/privacy` から `https://aiassetlab.jp/privacy` への308 Permanent Redirectを確認済み
- `contact@aiassetlab.jp` は作成済み、外部メールからの受信と返信を確認済み

Productionデプロイ未実行のため、現Production上では `robots.txt`, `sitemap.xml`, `manifest.webmanifest` が404です。最新commitをProductionへデプロイした後、Production Smoke Testで再確認してください。

---

## Deployment Step 5 Pre-Deploy Status

2026-07-13時点のProductionデプロイ直前状態です。

- Branch: `feature/diagnosis-save`
- Latest committed baseline: `e8bf63a Deployment-Step3 Production Environment and Domain Readiness`
- Uncommitted changes: Step4 / Step5 documentation only
- Vercel CLI: Codex環境のPATHでは利用不可。`npx vercel --version` は利用可能だが、`npx vercel whoami` は認証確認でタイムアウト
- Vercel project link: `.vercel/project.json` 未作成
- Production deploy: 未実行
- Production Smoke Test: 未実行
- Current blocker before Go judgment: 最新ProductionデプロイとProduction Smoke Test

Codex側で安全にProductionデプロイを実行できないため、Vercel Dashboardで次の手順を実施してください。

1. GitHubにStep4 / Step5ドキュメント変更をcommit / pushする必要があるか、デプロイ対象に含める運用を確認する。
2. Vercel Dashboardで対象Projectを開く。
3. Deploymentsから `feature/diagnosis-save` の最新Deploymentを確認する。
4. ProductionへPromoteする場合は、対象commit hashが意図したものか確認する。
5. Production Branchへmerge / pushして自動Productionデプロイする場合は、merge対象と環境変数を確認する。
6. Productionデプロイ完了後、Production Deployment URLとcommit hashを記録する。
7. `https://aiassetlab.jp` でSmoke Testを実施する。

### Deployment Step 5 Result

2026-07-13時点で、ProductionデプロイとSmoke Testは完了しました。

- Production Deployment: Ready
- Production target commit: `e8bf63a`
- Production URL: `https://aiassetlab.jp`
- Production Deployment URL: Vercel Dashboardで確認
- Rollback target: Production公開前の直前正常Deployment
- `https://aiassetlab.jp`: 正常表示
- `https://www.aiassetlab.jp` から `https://aiassetlab.jp`: 308 Permanent Redirect確認済み
- SSL: 正常
- Vercel Authenticationによるブロックなし
- `robots.txt`: 200、`https://aiassetlab.jp/sitemap.xml` を参照
- `sitemap.xml`: 200、主要ページと `/privacy` / `/terms` 掲載確認
- `manifest.webmanifest`: 200、内容取得確認
- Top metadata: title / description / canonical確認済み
- canonical: `https://aiassetlab.jp`
- OGP image: `https://aiassetlab.jp/og-image.svg`
- Twitter metadata: `summary_large_image`
- Diagnosis: 5問回答から結果表示まで完走
- Portfolio: テスト資産登録・表示確認
- Dashboard: 合計・積立反映確認
- Portfolio削除: Portfolio / Dashboardとも元の状態へ復帰
- Chat: fallbackを初期公開仕様として維持
- Simulator: Preview QA済み、Production主要導線で重大問題なし
- Test data: 削除済み
- Major blocker: なし
- Production judgment: Go

残タスク:

- OpenAI API利用枠・Billing設定
- Search Console verification
- GA4 / Clarity導入判断
- Production監視
- 必要に応じたAnalytics導入Sprint

---

## Production Release Procedure

1. Vercel Production環境変数を設定する。
2. `NEXT_PUBLIC_SITE_URL` に `https://aiassetlab.jp` を設定する。
3. `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定する。
4. 初回公開では `OPENAI_API_KEY` を設定しない。
5. 初回Production公開時点ではGA4 / Clarityを未設定にし、Search Console verificationは独自ドメイン疎通後に設定する。
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
17. GA4 / Clarity / Search Consoleを有効化した場合は初回計測を確認する。GA4はProduction限定で導入済み、Clarityは未導入。

---

## Rollback Procedure

Production公開後に重大問題が見つかった場合は、次の順で対応します。

1. Vercelで直前の正常DeploymentをProductionへPromoteする。
2. 問題のあるDeploymentをProductionとして使い続けない。
3. 直近の環境変数変更を確認し、必要に応じて戻す。
4. Supabaseに意図しないデータ作成や破損がないか確認する。
5. 発生内容、影響範囲、暫定対応、恒久対応をドキュメントへ記録する。
6. 修正後はPreview QAを再実施してからProductionへ進める。
