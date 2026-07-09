import type { PortfolioSummary } from "../../features/portfolio/types";
import { formatCurrency } from "../../lib/portfolio/formatPortfolio";

type Props = {
  summary: PortfolioSummary;
};

export default function PortfolioSummaryCards({ summary }: Props) {
  return (
    <section className="grid gap-4 md:grid-cols-4">
      <div className="rounded-3xl bg-white p-6 shadow-sm md:col-span-2">
        <p className="text-sm font-bold text-slate-500">現在の資産合計</p>
        <p className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
          {formatCurrency(summary.totalAmount)}
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-500">毎月の積立</p>
        <p className="mt-3 text-2xl font-black text-blue-600">
          {formatCurrency(summary.totalMonthlyContribution)}
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-slate-500">登録資産</p>
        <p className="mt-3 text-2xl font-black text-slate-900">
          {summary.assetCount}件
        </p>
      </div>
    </section>
  );
}
