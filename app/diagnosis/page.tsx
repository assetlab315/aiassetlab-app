"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    title: "リスク許容度は？",
    options: [
      { label: "できるだけリスクを避けたい", value: 1 },
      { label: "多少の値動きは許容できる", value: 2 },
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
      { label: "まずは貯蓄を増やしたい", value: 1 },
      { label: "老後資金を作りたい", value: 2 },
      { label: "将来の自由度を上げたい", value: 3 },
    ],
  },
];

export default function DiagnosisPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const isDone = Object.keys(answers).length === questions.length;

  const score = useMemo(() => {
    const total = Object.values(answers).reduce((sum, v) => sum + v, 0);
    return Math.round((total / 15) * 100);
  }, [answers]);

  const resultType =
    score < 50
      ? "安定重視タイプ"
      : score < 75
        ? "バランス成長タイプ"
        : "積極成長タイプ";

  const comment =
    score < 50
      ? "まずは新NISAと全世界株を中心に、少額から始めるのがおすすめです。"
      : score < 75
        ? "新NISAを軸に、全世界株とS&P500をバランスよく組み合わせるのがおすすめです。"
        : "長期目線で成長資産を多めに持つことで、資産拡大を狙いやすいタイプです。";

  const current = questions[step];

  async function saveResult() {
    setSaving(true);

    try {
      const res = await fetch("/api/diagnosis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          type: resultType,
          comment,
          answers,
        }),
      });

      if (!res.ok) {
        alert("保存に失敗しました。");
        return;
      }

      const result = await res.json();
      const resultId = result?.data?.id;

      if (!resultId) {
        alert("診断結果IDの取得に失敗しました。");
        return;
      }

      router.push(`/result?id=${resultId}`);
    } catch {
      alert("保存中にエラーが発生しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <div className="aal-card p-5 md:p-8">
        <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-extrabold text-blue-700">
          AI資産形成診断 v2
        </p>

        {!isDone ? (
          <>
            <p className="text-sm font-bold text-slate-500">
              STEP {step + 1} / {questions.length}
            </p>

            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{
                  width: `${((step + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold">
              {current.title}
            </h1>

            <div className="mt-6 grid gap-3">
              {current.options.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setAnswers({
                      ...answers,
                      [current.id]: option.value,
                    });

                    if (step < questions.length - 1) {
                      setStep(step + 1);
                    }
                  }}
                  className="min-h-12 rounded-2xl border border-slate-200 bg-white p-5 text-left font-bold hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold">診断結果</h1>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                <p className="text-sm font-bold text-blue-100">
                  資産形成スコア
                </p>
                <p className="mt-3 text-6xl font-black">
                  {score}
                  <span className="text-xl">点</span>
                </p>
                <p className="mt-4 text-xl font-extrabold">
                  {resultType}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-extrabold text-slate-500">
                  AIコメント
                </p>
                <p className="mt-3 font-bold leading-8">{comment}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={saveResult}
                disabled={saving}
                className="aal-button"
                aria-label="診断結果を保存して結果ページへ進む"
              >
                {saving ? "保存中..." : "診断結果を見る"}
              </button>

              <Link className="aal-button-secondary" href="/portfolio">
                資産を見る
              </Link>

              <Link className="aal-button-secondary" href="/">
                ホームへ戻る
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
