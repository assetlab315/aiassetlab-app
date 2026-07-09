import FeatureNavigation from "../../components/navigation/FeatureNavigation";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            AI Asset Lab
          </p>
          <h1 className="text-3xl font-bold text-slate-900">AI Dashboard</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            今日やることと、次に使う機能をまとめて確認します。
            MVPではここを中心に Portfolio、Simulator、AI Chat へ移動します。
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-blue-600 p-5 text-white shadow-sm">
            <p className="text-sm font-semibold text-blue-100">Today</p>
            <h2 className="mt-2 text-xl font-bold">資産の現在地を確認する</h2>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              まずはPortfolioで資産配分を見て、Simulatorで将来を確認しましょう。
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Mission</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">毎月積立額を決める</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              無理なく続けられる金額を決めることが、資産形成の第一歩です。
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">AI Coach</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">迷ったら相談する</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              AI Chatで、次に何をすべきかをシンプルに整理します。
            </p>
          </div>
        </section>

        <FeatureNavigation currentPath="/dashboard" title="Dashboardから移動する" />
      </div>
    </main>
  );
}
