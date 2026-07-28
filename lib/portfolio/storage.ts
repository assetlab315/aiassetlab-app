import { PORTFOLIO_STORAGE_KEY } from "../../features/portfolio/constants";
import type { PortfolioAsset } from "../../features/portfolio/types";

const assetCategories = ["cash", "stock", "fund", "crypto", "pension", "other"];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isPortfolioAsset(value: unknown): value is PortfolioAsset {
  if (!value || typeof value !== "object") return false;
  const asset = value as PortfolioAsset;

  return (
    typeof asset.id === "string" &&
    typeof asset.name === "string" &&
    assetCategories.includes(asset.category) &&
    isFiniteNumber(asset.amount) &&
    asset.amount >= 0 &&
    isFiniteNumber(asset.monthlyContribution) &&
    asset.monthlyContribution >= 0 &&
    typeof asset.updatedAt === "string"
  );
}

export function loadPortfolioAssets(): PortfolioAsset[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isPortfolioAsset) : [];
  } catch {
    return [];
  }
}

export function savePortfolioAssets(assets: PortfolioAsset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(assets));
}
