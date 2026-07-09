import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardAssetImpact } from "../../features/dashboard/types";

type Props = {
  impact: DashboardAssetImpact;
};

export default function DashboardAssetImpactCard({ impact }: Props) {
  return (
    <Card variant="soft" className="bg-slate-50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black text-blue-600">{impact.label}</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            {impact.title}
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            {impact.description}
          </p>
        </div>
        <Button href={impact.ctaHref} variant="outline" className="shrink-0">
          {impact.ctaLabel}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black text-slate-500">中心資産</p>
          <p className="mt-2 text-lg font-black text-slate-900">
            {impact.mainAssetLabel}
          </p>
          <p className="mt-1 text-sm font-bold text-blue-600">
            {Math.round(impact.mainAssetRate)}%
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black text-slate-500">今日見るテーマ</p>
          <p className="mt-2 text-lg font-black text-slate-900">
            {impact.marketTheme}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4">
          <p className="text-xs font-black text-slate-500">おすすめ行動</p>
          <p className="mt-2 text-lg font-black text-slate-900">
            {impact.actionLabel}
          </p>
        </div>
      </div>
    </Card>
  );
}
