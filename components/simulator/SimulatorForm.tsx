import type { SimulatorInput } from "../../features/simulator/types";

type Props = {
  input: SimulatorInput;
  onChange: (input: SimulatorInput) => void;
};

export default function SimulatorForm({ input, onChange }: Props) {
  const updateValue = (key: keyof SimulatorInput, value: number) => {
    onChange({
      ...input,
      [key]: Number.isNaN(value) ? 0 : value,
    });
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">入力する</h2>
      <p className="mt-2 text-sm text-slate-500">
        まずはざっくりで大丈夫です。あとから何度でも変更できます。
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            毎月の積立額
          </span>
          <input
            type="number"
            value={input.monthlyAmount}
            onChange={(e) => updateValue("monthlyAmount", Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">運用年数</span>
          <input
            type="number"
            value={input.years}
            onChange={(e) => updateValue("years", Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            想定利回り（年率%）
          </span>
          <input
            type="number"
            step="0.1"
            value={input.annualRate}
            onChange={(e) => updateValue("annualRate", Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            現在の資産額
          </span>
          <input
            type="number"
            value={input.initialAmount}
            onChange={(e) => updateValue("initialAmount", Number(e.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
          />
        </label>
      </div>
    </section>
  );
}
