import { assetCategoryLabels } from '../../features/portfolio/constants';
import type { PortfolioAsset } from '../../features/portfolio/types';
import { formatYen } from '../../lib/portfolio/formatPortfolio';

type AssetCardProps = {
  asset: PortfolioAsset;
};

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-blue-600">{assetCategoryLabels[asset.category]}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{asset.name}</h3>
        </div>
        <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
          {formatYen(asset.monthlyContribution)} / 月
        </p>
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900">{formatYen(asset.amount)}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600">{asset.memo}</p>
    </article>
  );
}
