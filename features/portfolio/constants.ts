import type { AssetCategory, PortfolioAsset } from "./types";

export const PORTFOLIO_STORAGE_KEY = "aiassetlab_portfolio_assets_v1";

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  cash: "現金・預金",
  stock: "個別株",
  fund: "投資信託・NISA",
  crypto: "暗号資産",
  pension: "年金・iDeCo",
  other: "その他",
};

export const ASSET_CATEGORY_OPTIONS: { value: AssetCategory; label: string }[] = [
  { value: "cash", label: ASSET_CATEGORY_LABELS.cash },
  { value: "fund", label: ASSET_CATEGORY_LABELS.fund },
  { value: "stock", label: ASSET_CATEGORY_LABELS.stock },
  { value: "pension", label: ASSET_CATEGORY_LABELS.pension },
  { value: "crypto", label: ASSET_CATEGORY_LABELS.crypto },
  { value: "other", label: ASSET_CATEGORY_LABELS.other },
];

export const DEFAULT_ASSETS: PortfolioAsset[] = [
  {
    id: "asset-default-1",
    name: "生活防衛資金",
    category: "cash",
    amount: 800000,
    monthlyContribution: 0,
    memo: "まずは安心して続けるための現金です。",
    updatedAt: "2026-07-09T00:00:00.000Z",
  },
  {
    id: "asset-default-2",
    name: "新NISA 全世界株式",
    category: "fund",
    amount: 1200000,
    monthlyContribution: 30000,
    memo: "長期積立の中心資産です。",
    updatedAt: "2026-07-09T00:00:00.000Z",
  },
];
