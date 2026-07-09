import type { PortfolioAllocation } from '../../features/portfolio/types';
import { formatPercent, formatYen } from '../../lib/portfolio/formatPortfolio';

type AllocationBarProps = {
  allocations: PortfolioAllocation[];
};

export function AllocationBar({ allocations }: AllocationBarProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold text-blue-600">Allocation</p>
        <h2 className="text-xl font-bold text-slate-900">資産配分</h2>
      </div>
      <div className="space-y-4">
        {allocations.map((allocation) => (
          <div key={allocation.category}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">{allocation.label}</span>
              <span className="text-slate-500">
                {formatYen(allocation.amount)} / {formatPercent(allocation.rate)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${allocation.rate}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
