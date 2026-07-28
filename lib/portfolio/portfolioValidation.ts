import type { PortfolioAsset } from "../../features/portfolio/types";

export const assetCategories = ["cash", "stock", "fund", "crypto", "pension", "other"];

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isPortfolioAsset(value: unknown): value is PortfolioAsset {
  if (!value || typeof value !== "object") return false;
  const asset = value as PortfolioAsset;

  return (
    typeof asset.id === "string" &&
    asset.id.length > 0 &&
    typeof asset.name === "string" &&
    asset.name.trim().length > 0 &&
    assetCategories.includes(asset.category) &&
    isFiniteNumber(asset.amount) &&
    asset.amount >= 0 &&
    isFiniteNumber(asset.monthlyContribution) &&
    asset.monthlyContribution >= 0 &&
    typeof asset.updatedAt === "string" &&
    !Number.isNaN(Date.parse(asset.updatedAt))
  );
}

export function sanitizePortfolioAssets(values: unknown): PortfolioAsset[] {
  if (!Array.isArray(values)) return [];
  const seen = new Set<string>();

  return values.filter((asset): asset is PortfolioAsset => {
    if (!isPortfolioAsset(asset)) return false;
    if (seen.has(asset.id)) return false;
    seen.add(asset.id);
    return true;
  });
}
