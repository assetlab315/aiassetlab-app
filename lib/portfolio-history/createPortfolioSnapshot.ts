import type { PortfolioInsights } from "../../features/chat/types";
import type { AssetHealthScore } from "../../features/dashboard/types";
import type { PortfolioSnapshot } from "../../features/portfolio-history/types";
import type { PortfolioAsset } from "../../features/portfolio/types";
import { createPortfolioInsights } from "../chat/createPortfolioInsights";
import { createAssetHealthScore } from "../dashboard/createAssetHealthScore";

type CreatePortfolioSnapshotInput = {
  assets: PortfolioAsset[];
  portfolioInsights: PortfolioInsights | null;
  assetHealthScore: AssetHealthScore;
  monthlyContribution: number;
  createdAt?: Date;
};

function toFiniteNumber(value: number | undefined) {
  return Number.isFinite(value) ? Number(value) : 0;
}

function roundAmount(value: number) {
  return Math.round(toFiniteNumber(value));
}

function roundRatio(value: number) {
  return Math.round(toFiniteNumber(value) * 10) / 10;
}

function createStableHash(value: string) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return `ps-${(hash >>> 0).toString(36)}`;
}

function createId(fingerprint: string, createdAt: string) {
  return `${fingerprint}-${createdAt.replace(/[^0-9]/g, "").slice(0, 14)}`;
}

export function createPortfolioSnapshot({
  assets,
  portfolioInsights,
  assetHealthScore,
  monthlyContribution,
  createdAt = new Date(),
}: CreatePortfolioSnapshotInput): PortfolioSnapshot | null {
  if (!portfolioInsights || portfolioInsights.totalAssets <= 0) {
    return null;
  }

  const categories = portfolioInsights.categoryRatios
    .filter((category) => category.amount > 0)
    .map((category) => ({
      category: category.category,
      amount: roundAmount(category.amount),
      ratio: roundRatio(category.ratio),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  const largestCategory = categories.reduce<(typeof categories)[number] | null>(
    (largest, category) => {
      if (!largest || category.ratio > largest.ratio) return category;
      return largest;
    },
    null,
  );

  const normalizedAssets = assets
    .filter((asset) => roundAmount(asset.amount) > 0)
    .map((asset) => ({
      category: asset.category,
      amount: roundAmount(asset.amount),
      monthlyContribution: roundAmount(asset.monthlyContribution),
    }))
    .sort((a, b) =>
      `${a.category}:${a.amount}:${a.monthlyContribution}`.localeCompare(
        `${b.category}:${b.amount}:${b.monthlyContribution}`,
      ),
    );

  const healthFactorIds = assetHealthScore.factors
    .map((factor) => factor.id)
    .sort((a, b) => a.localeCompare(b));

  const fingerprintSource = JSON.stringify({
    assets: normalizedAssets,
    assetCount: portfolioInsights.investmentCount,
    categories,
    cashRatio: roundRatio(portfolioInsights.cashRatio),
    cryptoRatio: roundRatio(portfolioInsights.cryptoRatio),
    healthFactorIds,
    healthGrade: assetHealthScore.grade,
    healthScore: assetHealthScore.score,
    monthlyContribution: roundAmount(monthlyContribution),
    totalAssets: roundAmount(portfolioInsights.totalAssets),
  });
  const fingerprint = createStableHash(fingerprintSource);
  const createdAtIso = createdAt.toISOString();

  return {
    version: 1,
    id: createId(fingerprint, createdAtIso),
    createdAt: createdAtIso,
    fingerprint,
    totalAssets: roundAmount(portfolioInsights.totalAssets),
    assetCount: portfolioInsights.investmentCount,
    monthlyContribution: roundAmount(monthlyContribution),
    categories,
    cashRatio: roundRatio(portfolioInsights.cashRatio),
    cryptoRatio: roundRatio(portfolioInsights.cryptoRatio),
    largestCategory: largestCategory?.category ?? null,
    largestCategoryRatio: largestCategory?.ratio ?? 0,
    healthScore: assetHealthScore.score,
    healthGrade: assetHealthScore.grade,
    healthFactorIds,
  };
}

export function createPortfolioSnapshotFromAssets(
  assets: PortfolioAsset[],
  createdAt = new Date(),
) {
  const portfolioInsights = createPortfolioInsights(assets);
  const assetHealthScore = createAssetHealthScore({ portfolioInsights });
  const monthlyContribution = assets.reduce(
    (sum, asset) => sum + roundAmount(asset.monthlyContribution),
    0,
  );

  return createPortfolioSnapshot({
    assets,
    portfolioInsights,
    assetHealthScore,
    monthlyContribution,
    createdAt,
  });
}
