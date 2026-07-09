import { ASSET_CATEGORY_LABELS } from "../../features/portfolio/constants";
import type {
  AssetAllocation,
  AssetCategory,
  PortfolioAsset,
  PortfolioSummary,
} from "../../features/portfolio/types";

export function calculatePortfolioSummary(
  assets: PortfolioAsset[],
): PortfolioSummary {
  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const totalMonthlyContribution = assets.reduce(
    (sum, asset) => sum + asset.monthlyContribution,
    0,
  );
  const largestAsset = [...assets].sort((a, b) => b.amount - a.amount)[0];

  return {
    totalAmount,
    totalMonthlyContribution,
    assetCount: assets.length,
    largestAssetName: largestAsset?.name ?? "未登録",
    largestAssetAmount: largestAsset?.amount ?? 0,
  };
}

export function calculateAssetAllocation(
  assets: PortfolioAsset[],
): AssetAllocation[] {
  const totalAmount = assets.reduce((sum, asset) => sum + asset.amount, 0);
  const grouped = assets.reduce<Record<AssetCategory, number>>(
    (acc, asset) => {
      acc[asset.category] += asset.amount;
      return acc;
    },
    {
      cash: 0,
      stock: 0,
      fund: 0,
      crypto: 0,
      pension: 0,
      other: 0,
    },
  );

  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category: category as AssetCategory,
      label: ASSET_CATEGORY_LABELS[category as AssetCategory],
      amount,
      percentage: totalAmount === 0 ? 0 : (amount / totalAmount) * 100,
    }))
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}
