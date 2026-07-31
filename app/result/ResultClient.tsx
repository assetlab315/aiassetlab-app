"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  createInlineDiagnosisResult,
  loadLocalDiagnosisResult,
} from "../../lib/diagnosis/storage";

type DiagnosisResult = {
  id: string;
  score: number;
  type: string;
  comment: string;
  answers: Record<string, number>;
  created_at?: string;
};

function getAiAnalysis(result: DiagnosisResult) {
  if (result.score < 50) {
    return "現在は、資産形成を始める前の準備段階です。まずは少額積立とAIによる情報整理から始めることで、無理なく資産形成の土台を作れます。";
  }

  if (result.score < 75) {
    return "投資への関心と積立余力があり、バランスよく資産形成を進められる状態です。AIを使って情報収集・家計管理・投資判断の補助を行うことで、継続しやすくなります。";
  }

  return "積極的に資産形成を進められるタイプです。長期運用に加えて、AIを活用した副業・情報収集・投資管理を組み合わせることで、資産形成スピードを高められます。";
}

function getTodayMissions(result: DiagnosisResult) {
  if (result.score < 50) {
    return [
      "毎月の積立可能額を決める",
      "積立シミュレーターで将来資産を確認する",
      "AI相談で資産形成の疑問を1つ質問する",
    ];
  }

  if (result.score < 75) {
    return [
      "新NISAで積み立てる候補を整理する",
      "毎月の積立額をシミュレーターで試す",
      "AIに自分向けの投資ルールを相談する",
    ];
  }

  return [
    "積立額とリスク許容度を再確認する",
    "AIを使って副業・収入源アイデアを整理する",
    "資産を見て運用方針を決める",
  ];
}

function getRoadmap(result: DiagnosisResult) {
  if (result.score < 50) {
    return [
      { label: "今日", text: "毎月いくら積み立てられるか決める" },
      { label: "今週", text: "新NISAや全世界株の基本を学ぶ" },
      { label: "今月", text: "少額から積立設定を始める" },
      { label: "90日", text: "積立を継続し、AIで家計管理を習慣化する" },
    ];
  }

  if (result.score < 75) {
    return [
      { label: "今日", text: "積立シミュレーターで目標金額を試算する" },
      { label: "今週", text: "投資方針をAIに相談して整理する" },
      { label: "今月", text: "新NISAを軸に積立を開始・見直しする" },
      { label: "90日", text: "資産状況を確認し、積立額を調整する" },
    ];
  }

  return [
    { label: "今日", text: "現在の資産配分と積立額を確認する" },
    { label: "今週", text: "AIを使って副業・収入源候補を整理する" },
    { label: "今月", text: "投資とAI活用の両方で行動計画を作る" },
    { label: "90日", text: "AI収入を資産形成へ回す仕組みを作る" },
  ];
}

export default function ResultClient() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchResult() {
      const inlineResult = createInlineDiagnosisResult(searchParams);
      if (inlineResult) {
        if (!isMounted) return;
        setResult(inlineResult);
        setLoading(false);
        return;
      }

      if (!resultId) {
        if (isMounted) setLoading(false);
        return;
      }

      const localResult = loadLocalDiagnosisResult(resultId);
      if (localResult) {
        if (!isMounted) return;
        setResult(localResult);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/diagnosis?id=${resultId}`);
        if (!res.ok) {
          if (isMounted) setLoading(false);
          return;
        }

        const json = await res.json();
        if (!isMounted) return;
        setResult(json.data ?? null);
      } catch {
        if (!isMounted) return;
        setResult(null);
      }

      if (isMounted) setLoading(false);
    }

    fetchResult();
    return () => {
      isMounted = false;
    };
  }, [resultId, searchParams]);

  const aiAnalysis = useMemo(() => {
    if (!result) return "";
    return getAiAnalysis(result);
  }, [result]);

  const todayMissions = useMemo(() => {
    if (!result) return [];
    return getTodayMissions(result);
  }, [result]);

  const roadmap = useMemo(() => {
    if (!result) return [];
    return getRoadmap(result);
  }, [result]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-gray-700">診断結果を読み込み中です...</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            診断結果が見つかりません
          </h1>

          <p className="mb-6 text-gray-700">
            もう一度診断を行ってください。
          </p>

          <Link
            href="/diagnosis"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            診断する
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            AI Asset Lab Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            あなたは「{result.type}」です
          </h1>

          <div className="mt-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <p className="text-sm font-bold text-blue-100">
              AI資産形成スコア
            </p>
            <p className="mt-3 text-6xl font-black">
              {result.score}
              <span className="text-xl">点</span>
            </p>
            <p className="mt-4 text-lg font-bold">{result.comment}</p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            AI分析
          </h2>
          <p className="leading-8 text-gray-700">{aiAnalysis}</p>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            今日のミッション
          </h2>

          <div className="space-y-3">
            {todayMissions.map((mission) => (
              <div
                key={mission}
                className="rounded-2xl border border-gray-200 p-4 font-semibold text-gray-700"
              >
                □ {mission}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            90日ロードマップ
          </h2>

          <div className="grid gap-4 md:grid-cols-4">
            {roadmap.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 p-5"
              >
                <p className="mb-2 text-sm font-bold text-blue-600">
                  {item.label}
                </p>
                <p className="font-semibold leading-7 text-gray-700">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-gray-900">
            おすすめ機能
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/portfolio"
              className="rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-xl font-bold text-gray-900">
                資産を見る
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                診断後は、今の資産を1つ登録します。
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-xl font-bold text-gray-900">
                Dashboardを見る
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                資産登録後に、今日やることを確認します。
              </p>
            </Link>

            <Link
              href="/chat"
              className="rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="text-xl font-bold text-gray-900">
                AIに相談する
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                資産形成の疑問をAIに相談します。
              </p>
            </Link>
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/portfolio"
            className="rounded-full bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            資産を見る
          </Link>

          <Link
            href="/diagnosis"
            className="rounded-full border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            もう一度診断する
          </Link>

          <Link
            href="/"
            className="rounded-full border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
