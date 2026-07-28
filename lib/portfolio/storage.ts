import { PORTFOLIO_STORAGE_KEY } from "../../features/portfolio/constants";
import type { PortfolioAsset } from "../../features/portfolio/types";
import { sanitizePortfolioAssets } from "./portfolioValidation";

export function loadPortfolioAssets(): PortfolioAsset[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return sanitizePortfolioAssets(parsed);
  } catch {
    return [];
  }
}

export function savePortfolioAssets(assets: PortfolioAsset[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(assets));
}

export function clearPortfolioAssets() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
}
