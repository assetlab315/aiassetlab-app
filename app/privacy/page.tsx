import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "AI Asset Labの個人情報と利用データの取り扱い方針を確認できます。",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
        <h1 className="mt-2 text-3xl font-black">プライバシーポリシー</h1>
        <p className="mt-4 leading-7 text-slate-600">
          このページは公開準備用のプレースホルダーです。AI Asset Labでは、サービス提供、品質改善、問い合わせ対応のために必要な範囲で情報を取り扱います。
        </p>
        <section className="mt-8 space-y-4 leading-7 text-slate-600">
          <h2 className="text-xl font-bold text-slate-900">取得する情報</h2>
          <p>診断回答、登録資産情報、アクセス解析情報、お問い合わせ内容など、サービス利用に必要な情報を取得する場合があります。</p>
          <h2 className="text-xl font-bold text-slate-900">利用目的</h2>
          <p>サービス提供、機能改善、不具合調査、利用状況の分析、問い合わせ対応のために利用します。</p>
          <h2 className="text-xl font-bold text-slate-900">お問い合わせ</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは{" "}
            <a className="font-bold text-blue-700 underline" href="mailto:contact@aiassetlab.jp">
              contact@aiassetlab.jp
            </a>{" "}
            までご連絡ください。
          </p>
        </section>
      </article>
    </main>
  );
}
