import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
  description: "AI Asset Labの利用条件、免責事項、問い合わせ先を確認できます。",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
        <h1 className="mt-2 text-3xl font-black">利用規約</h1>
        <p className="mt-4 leading-7 text-slate-600">
          このページは公開準備用のプレースホルダーです。正式な規約文面は公開前に確定します。
        </p>
        <section className="mt-8 space-y-4 leading-7 text-slate-600">
          <h2 className="text-xl font-bold text-slate-900">サービスの位置づけ</h2>
          <p>AI Asset Labは、資産形成の現在地と次の行動を整理するための情報提供サービスです。</p>
          <h2 className="text-xl font-bold text-slate-900">免責事項</h2>
          <p>本サービスの表示内容は投資判断を保証するものではありません。最終的な判断は利用者ご自身の責任で行ってください。</p>
          <h2 className="text-xl font-bold text-slate-900">お問い合わせ</h2>
          <p>
            利用規約に関するお問い合わせは{" "}
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
