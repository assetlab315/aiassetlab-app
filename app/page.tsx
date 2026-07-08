import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Calculator, CheckCircle2, Gauge, TrendingUp } from "lucide-react";

const steps = [
  { label: "AI診断", done: false, href: "/diagnosis" },
  { label: "積立シミュレーション", done: false, href: "/simulator" },
  { label: "ポートフォリオ診断", done: false, href: "/portfolio" },
  { label: "AI相談", done: false, href: "/chat" },
];

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <section className="aal-card overflow-hidden">
        <div className="grid gap-8 p-7 md:grid-cols-[1.2fr_.8fr] md:p-10">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-extrabold text-blue-700">
              AI Asset Dashboard β
            </p>
            <h1 className="aal-title">資産形成を、AIで見える化。</h1>
            <p className="mt-5 max-w-2xl text-slate-600">
              AI診断、積立シミュレーション、ポートフォリオ診断を1つのダッシュボードで管理します。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="aal-button" href="/diagnosis">
                AI診断を始める <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link className="aal-button-secondary" href="/simulator">
                積立を試算する
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
            <p className="text-sm font-bold text-blue-100">現在の資産形成スコア</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-6xl font-black">--</span>
              <span className="pb-2 text-lg font-extrabold">点</span>
            </div>
            <p className="mt-4 text-sm text-blue-100">
              AI診断を完了すると、あなたのスコアと次にやることが表示されます。
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="aal-card p-6">
          <Gauge className="text-blue-600" />
          <p className="aal-label mt-4">診断ステータス</p>
          <p className="mt-1 text-xl font-extrabold">未診断</p>
        </div>
        <div className="aal-card p-6">
          <TrendingUp className="text-emerald-600" />
          <p className="aal-label mt-4">今週のおすすめ</p>
          <p className="mt-1 text-xl font-extrabold">積立額を確認</p>
        </div>
        <div className="aal-card p-6">
          <BarChart3 className="text-violet-600" />
          <p className="aal-label mt-4">次の目標</p>
          <p className="mt-1 text-xl font-extrabold">100万円到達プラン</p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="aal-card p-6">
          <h2 className="text-xl font-extrabold">はじめるステップ</h2>
          <div className="mt-5 space-y-3">
            {steps.map((step) => (
              <Link key={step.label} href={step.href} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={step.done ? "text-blue-600" : "text-slate-300"} />
                  <span className="font-bold">{step.label}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="aal-card p-6">
          <h2 className="text-xl font-extrabold">AIからの今週のアドバイス</h2>
          <div className="mt-5 rounded-3xl bg-blue-50 p-5">
            <p className="font-extrabold text-blue-900">まずは診断から始めましょう。</p>
            <p className="mt-2 text-sm leading-7 text-blue-900/80">
              診断結果に応じて、積立額・資産配分・次に読むべき記事を自動で整理します。
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/portfolio" className="rounded-2xl border p-4 hover:bg-slate-50">
              <Calculator className="text-blue-600" />
              <p className="mt-3 font-extrabold">ポートフォリオ確認</p>
            </Link>
            <Link href="/chat" className="rounded-2xl border p-4 hover:bg-slate-50">
              <Bot className="text-blue-600" />
              <p className="mt-3 font-extrabold">AIに相談する</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
