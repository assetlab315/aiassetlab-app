import { CircleDollarSign } from "lucide-react";

type Props = {
  onAddAsset?: () => void;
};

export default function EmptyPortfolio({ onAddAsset }: Props) {
  return (
    <section
      aria-labelledby="empty-portfolio-title"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
        >
          <CircleDollarSign className="h-5 w-5" />
        </span>
        <h2 id="empty-portfolio-title" className="text-xl font-black text-slate-900">
          まだ資産がありません。
        </h2>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        最初は現金や銀行預金だけでもOKです。
      </p>
      {onAddAsset ? (
        <button
          type="button"
          onClick={onAddAsset}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
        >
          資産を追加
        </button>
      ) : null}
    </section>
  );
}
