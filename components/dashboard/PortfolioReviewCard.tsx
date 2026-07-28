import Card from "../ui/Card";
import type {
  PortfolioReview,
  PortfolioReviewHighlight,
} from "../../features/dashboard/types";

type Props = {
  review: PortfolioReview | null;
};

const toneLabel: Record<PortfolioReviewHighlight["tone"], string> = {
  positive: "良かった点",
  neutral: "維持したい点",
  caution: "改善したい点",
};

export default function PortfolioReviewCard({ review }: Props) {
  if (!review) {
    return (
      <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="animate-pulse space-y-4" aria-hidden="true">
          <div className="h-4 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-7 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black text-blue-600 dark:text-blue-300">
            AIレビュー
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {review.title}
          </h2>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-200 px-3 py-1 text-xs font-black text-slate-600 dark:border-slate-700 dark:text-slate-300">
          確度 {review.confidence === "high" ? "高" : "中"}
        </span>
      </div>

      <p className="mt-5 max-w-3xl text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">
        {review.summary}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {review.highlights.map((highlight, index) => (
          <div key={`${highlight.tone}-${index}`} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs font-black text-slate-500 dark:text-slate-400">
              {toneLabel[highlight.tone]}
            </p>
            <p className="mt-2 text-sm font-black leading-6 text-slate-900 dark:text-white">
              {highlight.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
        <p className="text-xs font-black text-slate-500 dark:text-slate-400">
          次に改善したい点
        </p>
        <p className="mt-2 text-sm font-black leading-6 text-slate-900 dark:text-white">
          {review.nextAction}
        </p>
      </div>
    </Card>
  );
}
