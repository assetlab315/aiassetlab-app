import Link from "next/link";
import PageContainer from "../components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer size="md">
      <section
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      >
        <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">
          ページが見つかりません
        </h1>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          URLが間違っているか、ページが移動した可能性があります。
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Dashboardへ戻る
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
