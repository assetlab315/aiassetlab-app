import { ASSET_CATEGORY_OPTIONS } from "../../features/portfolio/constants";
import type { AssetFormInput } from "../../features/portfolio/types";

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

type Props = {
  input: AssetFormInput;
  isEditing: boolean;
  isSaving?: boolean;
  onChange: (input: AssetFormInput) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function AssetForm({
  input,
  isEditing,
  isSaving = false,
  onCancel,
  onChange,
  onSubmit,
}: Props) {
  const canSubmit = input.name.trim().length > 0 && !isSaving;

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50 p-5 md:p-6">
      <p className="text-sm font-bold text-blue-600">資産を登録</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900">
        {isEditing ? "資産を編集する" : "まず1つ追加しましょう"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        正確でなくても大丈夫です。ざっくり登録するだけで、今の状態が見えるようになります。
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-bold text-slate-700">資産名</span>
          <input
            className={inputClass}
            aria-label="資産名"
            placeholder="例：新NISA 全世界株式"
            value={input.name}
            onChange={(event) => onChange({ ...input, name: event.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">種類</span>
          <select
            className={inputClass}
            aria-label="資産の種類"
            value={input.category}
            onChange={(event) =>
              onChange({
                ...input,
                category: event.target.value as AssetFormInput["category"],
              })
            }
          >
            {ASSET_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">現在の金額</span>
          <input
            className={inputClass}
            aria-label="現在の金額"
            inputMode="numeric"
            placeholder="例：1200000"
            type="number"
            value={input.amount}
            onChange={(event) => onChange({ ...input, amount: event.target.value })}
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">毎月の積立額</span>
          <input
            className={inputClass}
            aria-label="毎月の積立額"
            inputMode="numeric"
            placeholder="例：30000"
            type="number"
            value={input.monthlyContribution}
            onChange={(event) =>
              onChange({ ...input, monthlyContribution: event.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">メモ</span>
          <textarea
            className={`${inputClass} min-h-24 resize-none`}
            aria-label="資産メモ"
            placeholder="例：長期で積み立てる中心資産"
            value={input.memo}
            onChange={(event) => onChange({ ...input, memo: event.target.value })}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="min-h-12 rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isEditing ? "変更を保存する" : "資産を追加する"}
        </button>

        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="min-h-12 rounded-full border border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            キャンセル
          </button>
        ) : null}
      </div>
    </section>
  );
}
