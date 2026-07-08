"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const questions = [
  {
    id: "age",
    title: "年齢を教えてください",
    options: [
      { label: "20代", value: 3 },
      { label: "30代", value: 3 },
      { label: "40代", value: 2 },
      { label: "50代以上", value: 1 },
    ],
  },
  {
    id: "experience",
    title: "投資経験はありますか？",
    options: [
      { label: "ほとんどない", value: 1 },
      { label: "少しある", value: 2 },
      { label: "ある程度ある", value: 3 },
    ],
  },
  {
    id: "risk",
    title: "リスク許容度はどれに近いですか？",
    options: [
      { label: "元本割れはできるだけ避けたい", value: 1 },
      { label: "多少の値動きなら許容できる", value: 2 },
      { label: "長期なら大きな値動きも許容できる", value: 3 },
    ],
  },
  {
    id: "monthly",
    title: "毎月いくら積み立てられそうですか？",
    options: [
      { label: "1万円未満", value: 1 },
      { label: "1〜3万円", value: 2 },
      { label: "3万円以上", value: 3 },
    ],
  },
  {
    id: "goal",
    title: "資産形成の目的は？",
    options: [
      { label: "まずは貯蓄の延長で増やしたい", value: 1 },
      { label: "老後資金を作りたい", value: 2 },
      { label: "将来の自由度を上げたい", value: 3 },
    ],
  },
];

export default function Diagnosis() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);

  const done = Object.keys(answers).length === questions.length;
  const score = useMemo(() => {
    const raw = Object.values(answers).reduce((a, b) => a + b, 0);
    return Math.round((raw / 15) * 100);
  }, [answers]);

  const type = score < 50 ? "安定重視タイプ" : score < 75 ? "バランス成長タイプ" : "積極成長タイプ";
  const comment =
    score < 50
      ? "まずは新NISAと全世界株を中心に、少額から慣れるのがおすすめです。"
      : score < 75
      ? "新NISAを軸に、全世界株とS&P500を組み合わせるバランス型が合っています。"
      : "長期目線で成長資産を多めに持つことで、資産拡大を狙いやすいタイプです。";

  const q = questions[step];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <div className="aal-card p-7 md:p-10">
        <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-extrabold text-blue-700">
          AI資産形成診断 v2
        </p>

        {!done ? (
          <>
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500">STEP {step + 1} / {questions.length}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold md:text-4xl">{q.title}</h1>
            <div className="mt-7 grid gap-3">
              {q.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    setAnswers({ ...answers, [q.id]: opt.value });
                    if (step < questions.length - 1) setStep(step + 1);
                  }}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-extrabold hover:border-blue-300 hover:bg-blue-50"
                >
                  {opt.label}
                  <ArrowRight size={18} />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold md:text-5xl">診断結果</h1>
            <div className="mt-7 grid gap-5 md:grid-cols-[.8fr_1.2fr]">
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <p className="text-sm font-bold text-blue-100">資産形成スコア</p>
                <p className="mt-3 text-6xl font-black">{score}<span className="text-xl">点</span></p>
                <p className="mt-4 text-lg font-extrabold">{type}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-extrabold text-slate-500">AI分析</p>
                <p className="mt-3 text-lg font-bold leading-8">{comment}</p>
                <div className="mt-5 space-y-3">
                  <p className="flex gap-2 font-bold"><CheckCircle2 className="text-blue-600" />新NISAを優先して検討</p>
                  <p className="flex gap-2 font-bold"><CheckCircle2 className="text-blue-600" />積立額をシミュレーション</p>
                  <p className="flex gap-2 font-bold"><CheckCircle2 className="text-blue-600" />資産配分を確認</p>
                </div>
              </div>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="aal-button" href="/simulator">積立をシミュレーション</Link>
              <Link className="aal-button-secondary" href="/portfolio">ポートフォリオ診断へ</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
