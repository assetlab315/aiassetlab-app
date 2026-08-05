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
          AI Asset Labを利用する際の基本的な条件と注意事項を定めます。本サービスを利用する方は、本規約の内容を確認したうえで利用してください。
        </p>
        <section className="mt-8 space-y-4 leading-7 text-slate-600">
          <h2 className="text-xl font-bold text-slate-900">サービスの位置づけ</h2>
          <p>AI Asset Labは、資産形成の現在地と次の行動を整理するための情報提供サービスです。金融商品取引、投資助言、個別銘柄の推奨を目的とするものではありません。</p>
          <h2 className="text-xl font-bold text-slate-900">免責事項</h2>
          <p>本サービスの表示内容は投資判断を保証するものではありません。最終的な判断は利用者ご自身の責任で行ってください。</p>
          <h2 className="text-xl font-bold text-slate-900">禁止事項</h2>
          <p>利用者は、法令に違反する行為、第三者の権利を侵害する行為、サービスの運営を妨げる行為、AI相談へ秘密情報や第三者の個人情報を入力する行為を行わないものとします。</p>
          <h2 className="text-xl font-bold text-slate-900">アカウントとデータ保存</h2>
          <p>ログイン機能を利用する場合、資産情報をアカウントに紐づけて保存できます。ログイン前にこのブラウザへ保存した資産情報は、利用者が選択した場合に限りアカウントへ移行します。共有端末ではログアウト後の表示状態に注意してください。</p>
          <h2 className="text-xl font-bold text-slate-900">外部サービス</h2>
          <p>本サービスは、認証、データ保存、ホスティング、AI回答、アクセス解析などのために外部サービスを利用する場合があります。各外部サービスの障害や仕様変更により、一部機能が利用できない場合があります。</p>
          <h2 className="text-xl font-bold text-slate-900">お問い合わせ</h2>
          <p>
            利用規約に関するお問い合わせは{" "}
            <a className="font-bold text-blue-700 underline" href="mailto:assetlab315@gmail.com">
              assetlab315@gmail.com
            </a>{" "}
            までご連絡ください。
          </p>
        </section>
      </article>
    </main>
  );
}
