import type { PortfolioAsset } from '../../features/portfolio/types';
import { AssetCard } from './AssetCard';

type AssetListProps = {
  assets: PortfolioAsset[];
};

export function AssetList({ assets }: AssetListProps) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">Assets</p>
          <h2 className="text-xl font-bold text-slate-900">資産一覧</h2>
        </div>
        <p className="text-sm text-slate-500">MVPではサンプル資産を表示</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}
