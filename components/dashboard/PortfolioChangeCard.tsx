import Card from "../ui/Card";
import type {
  DashboardChangeItem,
  DashboardChangeSummary,
} from "../../features/portfolio-history/types";

type Props = {
  changeSummary: DashboardChangeSummary | null;
};

function formatScoreDelta(scoreDelta: number | null) {
  if (scoreDelta === null) return null;
  if (scoreDelta === 0) return "Health Score 変化なし";
  return `Health Score ${scoreDelta > 0 ? "+" : "-"}${Math.abs(scoreDelta)}ポイント`;
}

function ChangeList({
  items,
  fallback,
}: {
  items: DashboardChangeItem[];
  fallback: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">
        {fallback}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
          <p className="text-sm font-black text-slate-900 dark:text-white">
            {item.label}
          </p>
          {item.description ? (
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function PortfolioChangeCard({ changeSummary }: Props) {
  if (!changeSummary) {
    return (
      <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse space-y-4" aria-hidden="true">
          <div className="h-4 w-32 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-7 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </Card>
    );
  }

  const scoreDeltaLabel = formatScoreDelta(changeSummary.scoreDelta);
  const changeItems = [
    ...changeSummary.cautionChanges,
    ...changeSummary.positiveChanges,
    ...changeSummary.neutralChanges,
  ].slice(0, 3);

  return (
    <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black text-blue-600 dark:text-blue-300">
            前回からの変化
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {changeSummary.title}
          </h2>
        </div>
        {changeSummary.comparedAt ? (
          <span className="inline-flex w-fit rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {changeSummary.comparedAt}の記録と比較
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          {scoreDeltaLabel ? (
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {scoreDeltaLabel}
            </p>
          ) : null}
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
            {changeSummary.summary}
          </p>
          <p className="mt-4 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">
            登録値と配分の比較です。運用益や市場変動の理由を断定するものではありません。
          </p>
        </div>

        <ChangeList
          items={changeItems}
          fallback="資産を更新すると、ここに意味のある変化が表示されます。"
        />
      </div>
    </Card>
  );
}
