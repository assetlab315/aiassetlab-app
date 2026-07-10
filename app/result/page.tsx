import { Suspense } from "react";
import ResultClient from "./ResultClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI資産形成診断の結果",
  description: "AI資産形成診断の結果から、資産登録、Dashboard、AI相談へ進む次の行動を確認できます。",
  alternates: {
    canonical: "/result",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-6 py-10">
          <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-gray-700">診断結果を読み込み中です...</p>
          </div>
        </main>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
