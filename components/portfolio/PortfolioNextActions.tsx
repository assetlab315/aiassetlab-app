import Link from "next/link";

export default function PortfolioNextActions() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Link
        href="/simulator"
        className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <p className="text-sm font-bold text-blue-600">次に進む場所</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">
          将来のお金を計算する →
        </h2>
        <p className="mt-3 leading-7 text-slate-500">
          資産を登録したら、今の積立ペースで将来いくらになりそうか確認しましょう。
        </p>
      </Link>

      <Link
        href="/chat"
        className="rounded-3xl bg-blue-600 p-6 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        <p className="text-sm font-bold text-blue-100">AI相談</p>
        <h2 className="mt-2 text-2xl font-black">AIに相談する →</h2>
        <p className="mt-3 leading-7 text-blue-50">
          資産配分や積立額について、次に何をすればいいかAI相談できます。
        </p>
      </Link>
    </section>
  );
}
