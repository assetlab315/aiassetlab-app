"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
        <h1 className="mt-2 text-3xl font-black">一時的なエラーが発生しました</h1>
        <p className="mt-4 leading-7 text-slate-600">
          ページの読み込みに失敗しました。もう一度試すか、Dashboardへ戻ってください。
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            もう一度試す
          </button>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-black text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            Dashboardへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
