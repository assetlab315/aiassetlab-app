import type { PortfolioSummary } from '../../features/portfolio/types';
import { formatYen } from '../../lib/portfolio/formatPortfolio';

type PortfolioSummaryCardsProps = {
  summary: PortfolioSummary;
};

export function PortfolioSummaryCards({ summary }: PortfolioSummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">総資産額</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{formatYen(summary.totalAmount)}</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">登録資産</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{summary.assetCount}件</p>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">現在のタイプ</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{summary.riskLabel}</p>
      </div>
    </section>
  );
}
