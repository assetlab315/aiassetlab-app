import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardInsights } from "../../features/dashboard/types";

type Props = {
  insight: DashboardInsights | null;
};

export default function DashboardInsightCard({ insight }: Props) {
  if (!insight) {
    return (
      <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse space-y-5" aria-hidden="true">
          <div className="h-4 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-7 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </Card>
    );
  }

  const stateLabel: Record<DashboardInsights["state"], string> = {
    empty: "未登録",
    warning: "要確認",
    positive: "良好",
    neutral: "確認",
  };

  return (
    <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black text-blue-600 dark:text-blue-300">AI Insight</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            今日の資産形成で見ること
          </h2>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {stateLabel[insight.state]}
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-black text-slate-500 dark:text-slate-400">今日のまとめ</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-100">
            {insight.summary}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-black text-slate-500 dark:text-slate-400">良い点</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-100">
            {insight.strength ?? "今は無理に良い点を決めつけません。"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-xs font-black text-slate-500 dark:text-slate-400">注意点</p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-100">
            {insight.warning ?? "大きな注意点は見つかっていません。"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black text-slate-500 dark:text-slate-400">今日やること</p>
          <p className="mt-2 text-sm font-black leading-6 text-slate-900 dark:text-white">
            {insight.todayAction}
          </p>
        </div>
        {insight.actionHref && insight.actionLabel ? (
          <Button href={insight.actionHref} variant="outline" className="shrink-0">
            {insight.actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
