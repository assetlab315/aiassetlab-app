import type { SimulatorResult } from "../../features/simulator/types";
import { formatCurrency } from "../../lib/simulator/formatCurrency";

type Props = {
  result: SimulatorResult;
};

export default function SimulatorChart({ result }: Props) {
  const futureValue = Math.max(result.futureValue, 1);
  const principalRate = Math.min((result.principal / futureValue) * 100, 100);
  const profitRate = Math.max(Math.min((result.profit / futureValue) * 100, 100), 0);

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 p-4">
      <h3 className="font-bold text-slate-900">資産の内訳</h3>

      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600">元本</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(result.principal)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-slate-400"
              style={{ width: `${principalRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-600">運用益</span>
            <span className="font-semibold text-slate-900">
              {formatCurrency(result.profit)}
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-blue-500"
              style={{ width: `${profitRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
