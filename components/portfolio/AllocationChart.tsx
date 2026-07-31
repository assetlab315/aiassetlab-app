import type { AssetAllocation } from "../../features/portfolio/types";
import { formatCurrency, formatPercent } from "../../lib/portfolio/formatPortfolio";

type Props = {
  allocations: AssetAllocation[];
};

export default function AllocationChart({ allocations }: Props) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-blue-600">資産配分</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {allocations.map((allocation) => (
          <div key={allocation.category}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-slate-700">{allocation.label}</span>
              <span className="text-slate-500">
                {formatCurrency(allocation.amount)} / {formatPercent(allocation.percentage)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${Math.max(allocation.percentage, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
