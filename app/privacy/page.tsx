import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "AI Asset Labの個人情報と利用データの取り扱い方針を確認できます。",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. 基本方針",
      body:
        "AI Asset Labは、利用者が資産形成の現在地を整理し、次の行動を考えるためのサービスです。取得した情報は、サービス提供、品質改善、問い合わせ対応など必要な範囲で適切に取り扱います。",
    },
    {
      title: "2. 取得する情報",
      body:
        "当サービスでは、診断回答、診断結果、登録された資産情報、AI相談に入力された内容、アクセス日時、閲覧ページ、端末やブラウザに関する情報、お問い合わせ内容などを取得する場合があります。",
    },
    {
      title: "3. 利用目的",
      body:
        "取得した情報は、診断結果やDashboardの表示、AI相談機能の提供、サービス改善、不具合調査、利用状況の分析、問い合わせ対応、安心して利用できる環境の維持のために利用します。",
    },
    {
      title: "4. アカウント情報・入力情報・資産情報の取り扱い",
      body:
        "利用者がログインする場合、Google OAuthまたはメール認証により取得できる識別子、メールアドレス、ログイン状態に関する情報を取り扱う場合があります。利用者が入力する資産名、資産金額、毎月の積立額、メモなどの情報は、サービス内で資産状況を表示し、次の行動を整理するために利用します。パスワード、秘密鍵、クレジットカード番号などの機密情報は入力しないでください。",
    },
    {
      title: "5. AI相談機能で入力される情報の取り扱い",
      body:
        "AI相談に入力された内容や回答生成に必要な文脈は、回答生成、サービス提供、品質改善、不具合調査のために利用される場合があります。また、回答生成のため外部AIサービス提供者へ送信される場合があります。個人を特定できる情報、金融機関の認証情報、パスワード、秘密鍵、クレジットカード番号、第三者の機密情報などはAI相談へ入力しないでください。",
    },
    {
      title: "6. アクセス解析ツール",
      body:
        "当サービスでは、サービス改善や利用状況の把握のため、Google AnalyticsやMicrosoft Clarityなどのアクセス解析ツールを利用する場合があります。これらのツールはCookie等を利用して、個人を直接特定しない形でアクセス状況を収集する場合があります。",
    },
    {
      title: "7. Cookieおよび類似技術",
      body:
        "当サービスでは、利便性向上、利用状況の分析、サービス改善のためにCookieおよび類似技術を利用する場合があります。ブラウザ設定によりCookieを無効化できますが、一部機能が正しく動作しない場合があります。",
    },
    {
      title: "8. 外部サービス・第三者提供",
      body:
        "当サービスでは、ホスティング、認証、データ保存、AI回答、アクセス解析などのために、Vercel、Supabase、OpenAI、Google Analyticsなどの外部サービスを利用する場合があります。これはサービス提供に必要な外部委託または外部サービス利用として扱い、法令に基づく場合を除き、利用者の同意なく個人情報を第三者へ販売することはありません。",
    },
    {
      title: "9. 情報の保存・安全管理",
      body:
        "取得した情報は、利用目的に必要な範囲で保存し、不正アクセス、紛失、改ざん、漏えい等を防ぐため、合理的な安全管理に努めます。",
    },
    {
      title: "10. 利用者自身による情報管理",
      body:
        "利用者は、サービス内で入力した情報を自身の判断で管理してください。不要な情報は削除し、正確性が必要な情報は利用者自身で確認してください。アカウント削除やクラウド保存データの削除については、正式な削除UIまたは削除APIを整備するまで、お問い合わせ先へご連絡ください。",
    },
    {
      title: "11. 免責・金融助言ではないこと",
      body:
        "AI Asset Labは、金融商品取引、投資助言、個別銘柄の推奨を目的とするサービスではありません。診断結果やAIの回答は参考情報であり、投資や資産形成に関する最終判断は利用者自身の責任で行ってください。",
    },
    {
      title: "12. プライバシーポリシーの改定",
      body:
        "当サービスは、必要に応じて本ポリシーを改定する場合があります。重要な変更がある場合は、サービス上で分かりやすい形でお知らせします。クラウド保存、国外サーバー利用、削除請求対応などの詳細は、正式公開前または運用変更前に専門家確認を行う予定です。",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
        <h1 className="mt-2 text-3xl font-black">プライバシーポリシー</h1>
        <p className="mt-4 leading-7 text-slate-600">
          AI Asset Labにおける個人情報、入力情報、アクセス解析情報などの取り扱い方針を定めます。
        </p>
        <section className="mt-8 space-y-7 leading-7 text-slate-600">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              <p className="mt-2">{section.body}</p>
            </div>
          ))}

          <div>
            <h2 className="text-xl font-bold text-slate-900">13. 問い合わせ先</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは{" "}
            <a className="font-bold text-blue-700 underline" href="mailto:assetlab315@gmail.com">
              assetlab315@gmail.com
            </a>{" "}
            までご連絡ください。
          </p>
          </div>
        </section>
      </article>
    </main>
  );
}
