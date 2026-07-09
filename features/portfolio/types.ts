export type AssetCategory = 'cash' | 'stock' | 'fund' | 'crypto' | 'other';

export type PortfolioAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  targetRate: number;
  memo: string;
};

export type PortfolioSummary = {
  totalAmount: number;
  assetCount: number;
  monthlyAction: string;
  riskLabel: string;
};

export type PortfolioAllocation = {
  category: AssetCategory;
  label: string;
  amount: number;
  rate: number;
};
