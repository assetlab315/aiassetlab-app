export default function EmptyPortfolio() {
  return (
    <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold text-blue-600">まだ資産がありません</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900">
        まず1つだけ登録しましょう
      </h2>
      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
        銀行預金、NISA、iDeCoなど、いま分かる範囲で大丈夫です。登録すると資産配分が見えるようになります。
      </p>
    </section>
  );
}
