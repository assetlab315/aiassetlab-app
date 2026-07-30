"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error;
};

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
          <section
            role="alert"
            aria-live="assertive"
            className="mx-auto max-w-3xl rounded-3xl border border-red-100 bg-white p-6 shadow-sm md:p-8"
          >
            <p className="text-sm font-bold text-blue-600">AI Asset Lab</p>
            <h1 className="mt-2 text-3xl font-black">
              一時的な問題が発生しています
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              ページを再読み込みしてください。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                再読み込み
              </button>
              <a
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                ホームへ戻る
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
