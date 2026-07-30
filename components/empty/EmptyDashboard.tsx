import Link from "next/link";

export default function EmptyDashboard() {
  return (
    <section
      aria-labelledby="empty-dashboard-title"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-xl">
              📊
            </span>
            <h2 id="empty-dashboard-title" className="text-xl font-black text-slate-900">
              資産を登録しましょう
            </h2>
          </div>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            まずは現金だけでも登録すると、
            <br className="hidden sm:block" />
            AIによる分析を始められます。
          </p>
        </div>
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 py-2 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          資産を登録
        </Link>
      </div>
    </section>
  );
}
