export type AssetCategory =
  | "cash"
  | "stock"
  | "fund"
  | "crypto"
  | "pension"
  | "other";

export type PortfolioAsset = {
  id: string;
  name: string;
  category: AssetCategory;
  amount: number;
  monthlyContribution: number;
  memo?: string;
  updatedAt: string;
};

export type AssetFormInput = {
  name: string;
  category: AssetCategory;
  amount: string;
  monthlyContribution: string;
  memo: string;
};

export type PortfolioSummary = {
  totalAmount: number;
  totalMonthlyContribution: number;
  assetCount: number;
  largestAssetName: string;
  largestAssetAmount: number;
};

export type AssetAllocation = {
  category: AssetCategory;
  label: string;
  amount: number;
  percentage: number;
};
