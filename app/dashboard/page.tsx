import FeatureNavigation from "../../components/common/FeatureNavigation";
import PageTitle from "../../components/common/PageTitle";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  return (
    <PageContainer size="xl">
      <PageTitle
        title="AI Dashboard"
        description="今日やることと、次に使う機能をまとめて確認します。迷ったら、この画面から始めれば大丈夫です。"
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-600 text-white">
          <p className="text-sm font-semibold text-blue-100">Today</p>
          <h2 className="mt-2 text-xl font-black">資産の現在地を確認する</h2>
          <p className="mt-3 text-sm leading-6 text-blue-50">
            まずはPortfolioで資産配分を見て、Simulatorで将来を確認しましょう。
          </p>
          <div className="mt-5">
            <Button href="/portfolio" variant="secondary">
              Portfolioへ
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-blue-600">Mission</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">
            毎月積立額を決める
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            無理なく続けられる金額を決めることが、資産形成の第一歩です。
          </p>
          <div className="mt-5">
            <Button href="/simulator" variant="secondary">
              試算する
            </Button>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-blue-600">AI Coach</p>
          <h2 className="mt-2 text-xl font-black text-slate-900">
            迷ったら相談する
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            AI Chatで、次に何をすべきかをシンプルに整理します。
          </p>
          <div className="mt-5">
            <Button href="/chat" variant="secondary">
              AIへ相談
            </Button>
          </div>
        </Card>
      </section>

      <FeatureNavigation currentPath="/dashboard" title="Dashboardから移動する" />
    </PageContainer>
  );
}
