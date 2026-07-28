import type { AssetHealthGrade } from "../dashboard/types";

export type PortfolioSnapshotCategory = {
  category: string;
  amount: number;
  ratio: number;
};

export type PortfolioSnapshot = {
  version: 1;
  id: string;
  createdAt: string;
  fingerprint: string;
  totalAssets: number;
  assetCount: number;
  monthlyContribution: number;
  categories: PortfolioSnapshotCategory[];
  cashRatio: number;
  cryptoRatio: number;
  largestCategory: string | null;
  largestCategoryRatio: number;
  healthScore: number | null;
  healthGrade: AssetHealthGrade | null;
  healthFactorIds: string[];
};

export type PortfolioCategoryChange = {
  category: string;
  previousAmount: number;
  currentAmount: number;
  amountDelta: number;
  previousRatio: number;
  currentRatio: number;
  ratioDelta: number;
};

export type PortfolioChangeEvent =
  | {
      type: "contribution_started";
      previousValue: number;
      currentValue: number;
    }
  | {
      type: "contribution_stopped";
      previousValue: number;
      currentValue: number;
    }
  | {
      type: "contribution_changed";
      previousValue: number;
      currentValue: number;
    }
  | {
      type: "health_score_increased";
      delta: number;
    }
  | {
      type: "health_score_decreased";
      delta: number;
    }
  | {
      type: "health_score_unchanged";
    }
  | {
      type: "category_increased";
      category: string;
      ratioDelta: number;
    }
  | {
      type: "category_decreased";
      category: string;
      ratioDelta: number;
    }
  | {
      type: "health_factor_added";
      factorId: string;
    }
  | {
      type: "health_factor_resolved";
      factorId: string;
    };

export type PortfolioSnapshotComparison = {
  previousSnapshot: PortfolioSnapshot;
  currentSnapshot: PortfolioSnapshot;
  totalAssetsDelta: number;
  assetCountDelta: number;
  monthlyContributionDelta: number;
  healthScoreDelta: number | null;
  categoryChanges: PortfolioCategoryChange[];
  events: PortfolioChangeEvent[];
  hasMeaningfulChange: boolean;
};

export type DashboardChangeTone = "positive" | "caution" | "neutral";

export type DashboardChangeItem = {
  id: string;
  label: string;
  description?: string;
  tone: DashboardChangeTone;
  priority: number;
};

export type DashboardChangeSummary = {
  state: "no_history" | "no_change" | "improved" | "mixed" | "needs_attention";
  title: string;
  summary: string;
  scoreDelta: number | null;
  comparedAt: string | null;
  positiveChanges: DashboardChangeItem[];
  cautionChanges: DashboardChangeItem[];
  neutralChanges: DashboardChangeItem[];
};
