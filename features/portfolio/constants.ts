import type { AssetCategory } from "./types";

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

export const assetCategoryLabels = ASSET_CATEGORY_LABELS;

export const portfolioActions = {
  keep: "今の積立を続けましょう",
  rebalance: "資産配分を見直しましょう",
};
