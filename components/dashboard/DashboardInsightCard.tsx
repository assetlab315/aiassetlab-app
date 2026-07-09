import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardInsight } from "../../features/dashboard/types";

type Props = {
  insight: DashboardInsight;
};

export default function DashboardInsightCard({ insight }: Props) {
  return (
    <Card className="border border-blue-100 bg-gradient-to-br from-white via-white to-blue-50">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-center">
        <div>
          <p className="text-sm font-black text-blue-600">{insight.label}</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {insight.title}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            {insight.description}
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-slate-500">今日の見方</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                {insight.primaryPoint}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-slate-500">次の一歩</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                {insight.secondaryPoint}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href={insight.ctaHref}>{insight.ctaLabel}</Button>
            <Button href="/chat" variant="outline">
              AIに相談する
            </Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
          <p className="text-xs font-black text-slate-500">資産への影響</p>
          <p className="mt-2 text-3xl font-black text-slate-900">
            {insight.impactLabel}
          </p>
          <div className="mt-4 flex gap-2" aria-label={`影響度 ${insight.impactLevel}/3`}>
            {[1, 2, 3].map((level) => (
              <span
                key={level}
                className={`h-3 flex-1 rounded-full ${
                  level <= insight.impactLevel ? "bg-blue-600" : "bg-slate-100"
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-slate-600">
            数字の正確な予測ではなく、今日見るべきポイントをやさしく整理します。
          </p>
        </div>
      </div>
    </Card>
  );
}
