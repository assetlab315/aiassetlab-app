import SimulatorChart from "./SimulatorChart";
import type { SimulatorResult as SimulatorResultType } from "../../features/simulator/types";
import { formatCurrency } from "../../lib/simulator/formatCurrency";

type Props = {
  result: SimulatorResultType;
};

export default function SimulatorResult({ result }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">シミュレーション結果</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">将来の資産額</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {formatCurrency(result.futureValue)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">元本</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(result.principal)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">運用益</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(result.profit)}
          </p>
        </div>
      </div>

      <SimulatorChart result={result} />

      <p className="mt-4 text-xs leading-6 text-slate-500">
        ※この結果は概算です。実際の運用結果を保証するものではありません。
      </p>
    </section>
  );
}
