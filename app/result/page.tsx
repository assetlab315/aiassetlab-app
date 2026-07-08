"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type DiagnosisResult = {
  id: string;
  score: number;
  type: string;
  comment: string;
  answers: Record<string, number>;
  created_at?: string;
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const resultId = searchParams.get("id");

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      if (!resultId) {
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/diagnosis?id=${resultId}`);
      const json = await res.json();

      setResult(json.data);
      setLoading(false);
    }

    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-gray-700">診断結果を読み込み中です...</p>
        </div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            診断結果が見つかりません
          </h1>

          <p className="mb-6 text-gray-700">
            もう一度診断を行ってください。
          </p>

          <Link
            href="/diagnosis"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            診断する
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          AI資産形成診断 結果
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          あなたは「{result.type}」です
        </h1>

        <p className="mb-8 text-gray-700">
          {result.comment}
        </p>

        <section className="mb-8 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            資産形成スコア
          </h2>

          <p className="text-5xl font-black text-blue-600">
            {result.score}
            <span className="ml-1 text-xl text-gray-700">点</span>
          </p>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            おすすめアクション
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>まずは毎月の積立額を決める</li>
            <li>新NISAで長期運用の土台を作る</li>
            <li>積立シミュレーターで将来金額を確認する</li>
          </ul>
        </section>

        <section className="mb-8 rounded-xl bg-blue-50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            次にやるべきこと
          </h2>

          <p className="text-gray-700">
            まずは積立シミュレーターで、毎月の積立額と将来の資産額を確認しましょう。
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/simulator"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            積立シミュレーターへ
          </Link>

          <Link
            href="/diagnosis"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
          >
            もう一度診断する
          </Link>

          <Link
            href="/portfolio"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
          >
            ポートフォリオを見る
          </Link>
        </div>
      </div>
    </main>
  );
}