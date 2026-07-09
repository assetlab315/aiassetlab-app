import { ASSET_CATEGORY_LABELS } from "../../features/portfolio/constants";
import type { PortfolioAsset } from "../../features/portfolio/types";
import { formatCurrency } from "../../lib/portfolio/formatPortfolio";

type Props = {
  assets: PortfolioAsset[];
  onEdit: (asset: PortfolioAsset) => void;
  onDelete: (assetId: string) => void;
};

export default function AssetTable({ assets, onDelete, onEdit }: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-blue-600">登録済みの資産</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">資産一覧</h2>
        </div>
        <p className="text-sm text-slate-500">編集・削除できます</p>
      </div>

      <div className="space-y-3">
        {assets.map((asset) => (
          <article
            key={asset.id}
            className="rounded-3xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/30"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{asset.name}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {ASSET_CATEGORY_LABELS[asset.category]}
                  </span>
                </div>
                {asset.memo ? (
                  <p className="mt-2 text-sm leading-6 text-slate-500">{asset.memo}</p>
                ) : null}
              </div>

              <div className="min-w-52 text-left md:text-right">
                <p className="text-xl font-black text-slate-900">
                  {formatCurrency(asset.amount)}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  毎月 {formatCurrency(asset.monthlyContribution)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(asset)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => onDelete(asset.id)}
                className="rounded-full border border-red-100 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
              >
                削除
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
