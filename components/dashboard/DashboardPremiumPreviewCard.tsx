import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardPremiumPreview } from "../../features/dashboard/types";

const valueItems = [
  "資産の偏りをやさしく整理",
  "積立額の見直しポイントを提案",
  "次に確認するべき行動を1つに絞る",
];

type Props = {
  preview: DashboardPremiumPreview;
};

export default function DashboardPremiumPreviewCard({ preview }: Props) {
  return (
    <Card className="overflow-hidden border border-blue-100 bg-gradient-to-br from-white to-blue-50">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
              Premium候補
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-sm">
              {preview.badgeLabel}
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
            {preview.title}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            {preview.description}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={preview.ctaHref}>{preview.ctaLabel}</Button>
            <Button href="/chat" variant="outline">
              AIに相談する
            </Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
          <p className="text-sm font-black text-slate-900">無料版で見えること</p>
          <ul className="mt-4 space-y-3">
            {valueItems.map((item) => (
              <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-slate-600">
                <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-blue-600">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black text-slate-500">将来のPremium候補</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
              資産配分の深掘り、週次レポート、改善シミュレーションを有料機能として検証します。
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
