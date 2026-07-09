import { DEFAULT_ASSETS, PORTFOLIO_STORAGE_KEY } from "../../features/portfolio/constants";
import type { PortfolioAsset } from "../../features/portfolio/types";

export function loadPortfolioAssets(): PortfolioAsset[] {
  if (typeof window === "undefined") return DEFAULT_ASSETS;

  const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (!stored) return DEFAULT_ASSETS;

  try {
    const parsed = JSON.parse(stored) as PortfolioAsset[];
    return Array.isArray(parsed) ? parsed : DEFAULT_ASSETS;
  } catch {
    return DEFAULT_ASSETS;
  }
}

export function savePortfolioAssets(assets: PortfolioAsset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(assets));
}
