import { assetCategoryLabels, portfolioActions } from '../../features/portfolio/constants';
import type { AssetCategory, PortfolioAllocation, PortfolioAsset, PortfolioSummary } from '../../features/portfolio/types';

export function getPortfolioTotal(assets: PortfolioAsset[]): number {
  return assets.reduce((total, asset) => total + asset.amount, 0);
}

export function getPortfolioSummary(assets: PortfolioAsset[]): PortfolioSummary {
  const totalAmount = getPortfolioTotal(assets);
  const cashAmount = assets
    .filter((asset) => asset.category === 'cash')
    .reduce((total, asset) => total + asset.amount, 0);
  const cashRate = totalAmount === 0 ? 0 : (cashAmount / totalAmount) * 100;

  return {
    totalAmount,
    assetCount: assets.length,
    riskLabel: cashRate >= 30 ? '安定型' : '成長型',
    monthlyAction: cashRate >= 30 ? portfolioActions.rebalance : portfolioActions.keep,
  };
}

export function getPortfolioAllocation(assets: PortfolioAsset[]): PortfolioAllocation[] {
  const totalAmount = getPortfolioTotal(assets);
  const categories: AssetCategory[] = ['cash', 'fund', 'stock', 'crypto', 'other'];

  return categories
    .map((category) => {
      const amount = assets
        .filter((asset) => asset.category === category)
        .reduce((total, asset) => total + asset.amount, 0);

      return {
        category,
        label: assetCategoryLabels[category],
        amount,
        rate: totalAmount === 0 ? 0 : (amount / totalAmount) * 100,
      };
    })
    .filter((allocation) => allocation.amount > 0);
}
