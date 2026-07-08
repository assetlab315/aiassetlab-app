'use client'

import Link from 'next/link'

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          AI資産形成診断 結果
        </p>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          あなたは「AI活用スタート型」です
        </h1>

        <p className="mb-8 text-gray-700">
          現時点ではAIを本格的な収益化や資産形成に使う準備段階です。
          まずは日常業務や情報整理にAIを取り入れ、小さな成果を積み上げることが重要です。
        </p>

        <section className="mb-8 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            現在のレベル
          </h2>

          <p className="text-gray-700">
            レベル1：AI活用の入口
          </p>
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            おすすめアクション
          </h2>

          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            <li>ChatGPTで毎日の情報整理を自動化する</li>
            <li>副業・投資・事業アイデアをAIで壁打ちする</li>
            <li>自分のスキルや経験をAI資産に変換する</li>
          </ul>
        </section>

        <section className="mb-8 rounded-xl bg-blue-50 p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            次にやるべきこと
          </h2>

          <p className="text-gray-700">
            まずはポートフォリオで診断結果を確認し、今後のAI資産形成ステップを管理しましょう。
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/portfolio"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            ポートフォリオを見る
          </Link>

          <Link
            href="/diagnosis"
            className="rounded-lg border border-gray-300 px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    </main>
  )
}