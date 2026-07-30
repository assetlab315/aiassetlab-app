"use client";

import { useEffect } from "react";
import ErrorState from "../components/feedback/ErrorState";

type ErrorPageProps = {
  error: Error;
};

export default function ErrorPage({ error }: ErrorPageProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-3xl">
        <ErrorState
          title="問題が発生しました"
          description="ページを再読み込みしてください。"
          actionLabel="再読み込み"
          loadingLabel="再読み込み中…"
          onRetry={() => window.location.reload()}
        />
      </div>
    </main>
  );
}
