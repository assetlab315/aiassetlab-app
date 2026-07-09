import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TOP",
  description:
    "AI Asset Labの入口です。診断から資産登録、Dashboard、AI相談まで迷わず進めます。",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 md:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center">
        <p className="text-sm font-black text-blue-600">AI Asset Lab</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
          まず診断して、
          <br />
          資産形成の一歩を決める。
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          5つの質問に答えるだけで、今日やることが分かります。診断後は資産登録、Dashboard、AI相談へ進めます。
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/diagnosis"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            診断する
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-black text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            Dashboardを見る
          </Link>
        </div>
      </section>
    </main>
  );
}
