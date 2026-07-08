"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function yen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function calculateFutureValue(monthlyAmount: number, years: number, annualRate: number, initialAmount: number) {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const initialFutureValue = initialAmount * Math.pow(1 + monthlyRate, months);

  if (monthlyRate === 0) {
    return initialFutureValue + monthlyAmount * months;
  }

  return initialFutureValue + monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

export default function SimulatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(30000);
  const [years, setYears] = useState(20);
  const [annualRate, setAnnualRate] = useState(5);
  const [initialAmount, setInitialAmount] = useState(0);

  const result = useMemo(() => {
    const safeMonthlyAmount = Math.max(0, monthlyAmount);
    const safeYears = Math.max(1, years);
    const safeAnnualRate = Math.max(0, annualRate);
    const safeInitialAmount = Math.max(0, initialAmount);

    const principal = safeInitialAmount + safeMonthlyAmount * safeYears * 12;
    const futureValue = calculateFutureValue(
      safeMonthlyAmount,
      safeYears,
      safeAnnualRate,
      safeInitialAmount,
    );
    const profit = futureValue - principal;
    const profitRatio = principal === 0 ? 0 : Math.round((profit / principal) * 100);

    return {
      principal,
      futureValue,
      profit,
      profitRatio,
    };
  }, [monthlyAmount, years, annualRate, initialAmount]);

  const aiComment =
    result.profitRatio >= 50
      ? "長く続けるほど、複利の力が大きくなります。無理のない金額で続けることが一番大切です。"
      : "まずは毎月の積立を習慣にしましょう。金額よりも、止めずに続けることを優先します。";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold text-blue-600">Simulator MVP</p>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
                将来の資産額をシミュレーションする
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                毎月いくら積み立てると、将来どれくらいの資産になるかをかんたんに確認できます。
              </p>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Portfolioへ戻る
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
              <p className="text-sm font-bold text-blue-700">将来の資産額</p>
              <p className="mt-2 text-3xl font-extrabold text-blue-700">{yen(result.futureValue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm font-bold text-slate-600">積立元本</p>
              <p className="mt-2 text-3xl font-extrabold">{yen(result.principal)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
              <p className="text-sm font-bold text-slate-600">運用益</p>
              <p className="mt-2 text-3xl font-extrabold">{yen(result.profit)}</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
            <p className="text-sm font-bold text-blue-600">Input</p>
            <h2 className="mt-1 text-xl font-extrabold">シミュレーション条件</h2>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">毎月の積立額（円）</span>
                <input
                  type="number"
                  min="0"
                  value={monthlyAmount}
                  onChange={(event) => setMonthlyAmount(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">運用年数</span>
                <input
                  type="number"
                  min="1"
                  value={years}
                  onChange={(event) => setYears(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">想定利回り（年率%）</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={annualRate}
                  onChange={(event) => setAnnualRate(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">現在の資産額（円・任意）</span>
                <input
                  type="number"
                  min="0"
                  value={initialAmount}
                  onChange={(event) => setInitialAmount(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
              <p className="text-sm font-bold text-blue-600">Result</p>
              <h2 className="mt-1 text-xl font-extrabold">試算結果</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-extrabold">元本</p>
                    <p className="text-lg font-extrabold">{yen(result.principal)}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-extrabold text-blue-700">運用益</p>
                    <p className="text-lg font-extrabold text-blue-700">{yen(result.profit)}</p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-blue-600">元本に対して +{result.profitRatio}%</p>
                </div>
                <div className="rounded-2xl bg-slate-900 p-5 text-white">
                  <p className="text-sm font-bold text-slate-300">AIコメント</p>
                  <p className="mt-2 leading-8">{aiComment}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-blue-600 p-6 text-white shadow-sm md:p-8">
              <p className="text-sm font-bold text-blue-100">Next Action</p>
              <h2 className="mt-1 text-xl font-extrabold">次にやること</h2>
              <p className="mt-3 leading-8 text-blue-50">
                試算した金額をもとに、迷ったことをAIに相談して次の行動を決めましょう。
              </p>
              <Link
                href="/chat"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50"
              >
                AI Chatへ進む
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
