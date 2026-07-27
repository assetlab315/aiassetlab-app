import Card from "../ui/Card";
import type {
  AssetHealthGrade,
  AssetHealthScore,
  AssetHealthScoreFactor,
} from "../../features/dashboard/types";

type Props = {
  healthScore: AssetHealthScore | null;
};

const gradeLabel: Record<AssetHealthGrade, string> = {
  A: "バランス良好",
  B: "おおむね安定",
  C: "改善余地あり",
  D: "配分を確認",
};

function formatImpact(impact: number) {
  if (impact > 0) return `+${impact}`;
  return `${impact}`;
}

function getTopFactors(
  factors: AssetHealthScoreFactor[],
  type: AssetHealthScoreFactor["type"],
) {
  return factors
    .filter((factor) => factor.type === type)
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, 2);
}

function FactorList({
  title,
  factors,
  emptyText,
}: {
  title: string;
  factors: AssetHealthScoreFactor[];
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      <p className="text-xs font-black text-slate-500 dark:text-slate-400">{title}</p>
      <div className="mt-3 space-y-3">
        {factors.length > 0 ? (
          factors.map((factor) => (
            <div key={factor.id} className="flex gap-3">
              <span className="mt-0.5 min-w-9 text-sm font-black text-slate-700 dark:text-slate-200">
                {formatImpact(factor.impact)}
              </span>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {factor.label}
                </p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600 dark:text-slate-300">
                  {factor.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

export default function AssetHealthScoreCard({ healthScore }: Props) {
  if (!healthScore) {
    return (
      <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse space-y-5" aria-hidden="true">
          <div className="h-4 w-28 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-36 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </Card>
    );
  }

  const positiveFactors = getTopFactors(healthScore.factors, "positive");
  const negativeFactors = getTopFactors(healthScore.factors, "negative");
  const scoreLabel =
    healthScore.score === null ? "スコア未算出" : `${healthScore.score} / 100`;
  const gradeText = healthScore.grade ? gradeLabel[healthScore.grade] : "未算出";

  return (
    <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div>
          <p className="text-sm font-black text-blue-600 dark:text-blue-300">
            Asset Health
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <p className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {scoreLabel}
            </p>
            <span className="mb-1 inline-flex rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {gradeText}
            </span>
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
            {healthScore.summary}
          </p>
          <p className="mt-4 text-xs font-bold leading-5 text-slate-500 dark:text-slate-400">
            資産配分と積立状況を基にした参考指標です。投資成果を予測するものではありません。
          </p>

          {healthScore.state === "empty" ? (
            <p className="mt-5 text-sm font-black text-slate-700 dark:text-slate-200">
              Portfolioで資産を登録すると確認できます。
            </p>
          ) : (
            <p className="mt-5 rounded-2xl border border-slate-100 p-4 text-sm font-black text-slate-800 dark:border-slate-800 dark:text-slate-100">
              現在確認できる改善余地：{healthScore.improvementPotential}ポイント
            </p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <FactorList
            title="主なプラス理由"
            factors={positiveFactors}
            emptyText="今は明確なプラス理由を決めつけません。"
          />
          <FactorList
            title="主な改善理由"
            factors={negativeFactors}
            emptyText="大きな改善理由は見つかっていません。"
          />
        </div>
      </div>
    </Card>
  );
}
