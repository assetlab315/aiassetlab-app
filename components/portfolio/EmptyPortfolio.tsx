import Link from "next/link";

export default function EmptyPortfolio() {
  return (
    <section className="rounded-3xl bg-white p-6 text-center shadow-sm md:p-8">
      <p className="text-sm font-bold text-blue-600">まだ資産がありません</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900">
        まず1つだけ登録しましょう
      </h2>
      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        銀行預金、NISA、iDeCoなど、いま分かる範囲で大丈夫です。登録すると資産配分が見えるようになります。
      </p>
      <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-left">
        <p className="text-sm font-black text-blue-700">次にやること</p>
        <p className="mt-1 text-sm font-bold leading-6 text-slate-700">
          左のフォームに「資産名」と「現在の金額」を入れて、資産を追加します。
        </p>
      </div>
      <Link
        href="/dashboard"
        className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 font-black text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        Dashboardを見る
      </Link>
    </section>
  );
}
