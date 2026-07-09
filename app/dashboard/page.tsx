import ActionCard from "../../components/common/ActionCard";
import AIAdviceCard from "../../components/common/AIAdviceCard";
import FeatureNavigation from "../../components/common/FeatureNavigation";
import SectionHeader from "../../components/common/SectionHeader";
import PageContainer from "../../components/layout/PageContainer";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function DashboardPage() {
  return (
    <PageContainer size="xl">
      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-black text-blue-600">AI Dashboard</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              おかえりなさい。
              <br />
              今日はこの3つだけ進めましょう。
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              AI Asset Labは、難しい資産形成を毎日の小さな行動に分解します。迷ったら上から順番に進めれば大丈夫です。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/portfolio">まず資産を見る</Button>
              <Button href="/chat" variant="outline">
                AIに相談する
              </Button>
            </div>
          </div>

          <Card variant="soft" className="bg-slate-50">
            <p className="text-sm font-black text-slate-500">今日の進め方</p>
            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  1
                </span>
                <div>
                  <p className="font-black text-slate-900">資産を見る</p>
                  <p className="text-sm leading-6 text-slate-600">
                    現在地を確認します。
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  2
                </span>
                <div>
                  <p className="font-black text-slate-900">将来のお金を計算する</p>
                  <p className="text-sm leading-6 text-slate-600">
                    毎月いくら積み立てるかを決めます。
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                  3
                </span>
                <div>
                  <p className="font-black text-slate-900">AIに相談する</p>
                  <p className="text-sm leading-6 text-slate-600">
                    次にやることをシンプルに整理します。
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <AIAdviceCard />

      <section className="space-y-4">
        <SectionHeader
          eyebrow="今日やること"
          title="上から順番に進めればOKです"
          description="専門知識がなくても、今の状態を確認し、将来を計算し、迷ったところだけAIに相談できます。"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <ActionCard
            step="STEP 1"
            title="資産を見る"
            description="今の資産の内訳を確認し、偏りや次に見直すポイントを把握します。"
            href="/portfolio"
            actionLabel="資産を見る"
            tone="blue"
          />
          <ActionCard
            step="STEP 2"
            title="将来のお金を計算する"
            description="毎月の積立額を入力して、将来の資産額をかんたんに確認します。"
            href="/simulator"
            actionLabel="計算する"
            tone="emerald"
          />
          <ActionCard
            step="STEP 3"
            title="AIに相談する"
            description="NISA、積立額、副業、家計など、次の一歩をAIと一緒に整理します。"
            href="/chat"
            actionLabel="相談する"
            tone="violet"
          />
        </div>
      </section>

      <FeatureNavigation currentPath="/dashboard" title="ほかの機能へ移動する" />
    </PageContainer>
  );
}
