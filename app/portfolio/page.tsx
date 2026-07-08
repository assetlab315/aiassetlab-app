"use client";

import Link from "next/link";

const assets = [
  {
    name: "生活防衛資金",
    category: "現金",
    amount: 300000,
    allocation: 30,
    description: "急な出費に備えるためのお金です。まずはここを安定させます。",
  },
  {
    name: "つみたて投資",
    category: "投資信託",
    amount: 500000,
    allocation: 50,
    description: "長期で増やすための中心資産です。毎月の継続が大切です。",
  },
  {
    name: "自己投資・AI活用",
    category: "成長投資",
    amount: 200000,
    allocation: 20,
    description: "収入を増やすための学習・副業・AI活用に使う枠です。",
  },
];

const recommendedPortfolio = [
  { label: "守るお金", value: "30%", note: "生活費・緊急資金" },
  { label: "増やすお金", value: "50%", note: "長期の積立投資" },
  { label: "稼ぐ力", value: "20%", note: "AI学習・副業準備" },
];

function yen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PortfolioPage() {
  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const investmentAmount = assets
    .filter((asset) => asset.category !== "現金")
    .reduce((sum, asset) => sum + asset.amount, 0);
  const investmentRatio = Math.round((investmentAmount / totalAmount) * 100);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-blue-600">Portfolio MVP</p>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
                資産の現在地を確認する
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                いまのお金を「守る」「増やす」「稼ぐ力」に分けて、次に何をすればよいかを見える化します。
              </p>
            </div>
            <Link
              href="/result"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Dashboardへ戻る
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
              <p className="text-sm font-bold text-blue-700">総資産</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-700">{yen(totalAmount)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm font-bold text-slate-600">運用・成長資産</p>
              <p className="mt-2 text-3xl font-extrabold">{yen(investmentAmount)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm font-bold text-slate-600">攻めの割合</p>
              <p className="mt-2 text-3xl font-extrabold">{investmentRatio}%</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-600">Asset List</p>
                <h2 className="mt-1 text-xl font-extrabold">資産カード</h2>
              </div>
              <p className="text-sm text-slate-500">MVPサンプル</p>
            </div>

            <div className="space-y-4">
              {assets.map((asset) => (
                <article key={asset.name} className="rounded-2xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500">{asset.category}</p>
                      <h3 className="mt-1 text-lg font-extrabold">{asset.name}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{asset.description}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xl font-extrabold">{yen(asset.amount)}</p>
                      <p className="text-sm font-bold text-blue-600">{asset.allocation}%</p>
                    </div>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${asset.allocation}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <p className="text-sm font-bold text-blue-600">Recommended</p>
              <h2 className="mt-1 text-xl font-extrabold">推奨ポートフォリオ</h2>
              <div className="mt-5 space-y-3">
                {recommendedPortfolio.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-extrabold">{item.label}</p>
                      <p className="text-lg font-extrabold text-blue-600">{item.value}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-sm md:p-8">
              <p className="text-sm font-bold text-blue-100">Next Action</p>
              <h2 className="mt-1 text-xl font-extrabold">今日やること</h2>
              <p className="mt-3 leading-8 text-blue-50">
                まずは生活防衛資金を確認し、毎月いくら積立に回せるかを決めましょう。
              </p>
              <Link
                href="/simulator"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
              >
                積立シミュレーターへ進む
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
