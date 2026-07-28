import type {
  PortfolioCategoryChange,
  PortfolioChangeEvent,
  PortfolioSnapshot,
  PortfolioSnapshotComparison,
} from "../../features/portfolio-history/types";

const MEANINGFUL_RATIO_DELTA = 3;
const MEANINGFUL_SCORE_DELTA = 5;

function getCategoryAmount(snapshot: PortfolioSnapshot, category: string) {
  return snapshot.categories.find((item) => item.category === category)?.amount ?? 0;
}

function getCategoryRatio(snapshot: PortfolioSnapshot, category: string) {
  return snapshot.categories.find((item) => item.category === category)?.ratio ?? 0;
}

function roundDelta(value: number) {
  return Math.round(value * 10) / 10;
}

export function comparePortfolioSnapshots(
  previousSnapshot: PortfolioSnapshot,
  currentSnapshot: PortfolioSnapshot,
): PortfolioSnapshotComparison {
  const totalAssetsDelta = currentSnapshot.totalAssets - previousSnapshot.totalAssets;
  const assetCountDelta = currentSnapshot.assetCount - previousSnapshot.assetCount;
  const monthlyContributionDelta =
    currentSnapshot.monthlyContribution - previousSnapshot.monthlyContribution;
  const healthScoreDelta =
    previousSnapshot.healthScore === null || currentSnapshot.healthScore === null
      ? null
      : currentSnapshot.healthScore - previousSnapshot.healthScore;

  const categoryNames = Array.from(
    new Set([
      ...previousSnapshot.categories.map((category) => category.category),
      ...currentSnapshot.categories.map((category) => category.category),
    ]),
  ).sort((a, b) => a.localeCompare(b));

  const categoryChanges: PortfolioCategoryChange[] = categoryNames.map((category) => {
    const previousAmount = getCategoryAmount(previousSnapshot, category);
    const currentAmount = getCategoryAmount(currentSnapshot, category);
    const previousRatio = getCategoryRatio(previousSnapshot, category);
    const currentRatio = getCategoryRatio(currentSnapshot, category);

    return {
      category,
      previousAmount,
      currentAmount,
      amountDelta: currentAmount - previousAmount,
      previousRatio,
      currentRatio,
      ratioDelta: roundDelta(currentRatio - previousRatio),
    };
  });

  const events: PortfolioChangeEvent[] = [];

  if (previousSnapshot.monthlyContribution === 0 && currentSnapshot.monthlyContribution > 0) {
    events.push({
      type: "contribution_started",
      previousValue: previousSnapshot.monthlyContribution,
      currentValue: currentSnapshot.monthlyContribution,
    });
  } else if (
    previousSnapshot.monthlyContribution > 0 &&
    currentSnapshot.monthlyContribution === 0
  ) {
    events.push({
      type: "contribution_stopped",
      previousValue: previousSnapshot.monthlyContribution,
      currentValue: currentSnapshot.monthlyContribution,
    });
  } else if (monthlyContributionDelta !== 0) {
    events.push({
      type: "contribution_changed",
      previousValue: previousSnapshot.monthlyContribution,
      currentValue: currentSnapshot.monthlyContribution,
    });
  }

  if (healthScoreDelta === null) {
    // No score event when either side is unscored.
  } else if (healthScoreDelta >= MEANINGFUL_SCORE_DELTA) {
    events.push({ type: "health_score_increased", delta: healthScoreDelta });
  } else if (healthScoreDelta <= -MEANINGFUL_SCORE_DELTA) {
    events.push({ type: "health_score_decreased", delta: healthScoreDelta });
  } else if (healthScoreDelta === 0) {
    events.push({ type: "health_score_unchanged" });
  }

  categoryChanges.forEach((change) => {
    if (change.ratioDelta >= MEANINGFUL_RATIO_DELTA) {
      events.push({
        type: "category_increased",
        category: change.category,
        ratioDelta: change.ratioDelta,
      });
    } else if (change.ratioDelta <= -MEANINGFUL_RATIO_DELTA) {
      events.push({
        type: "category_decreased",
        category: change.category,
        ratioDelta: change.ratioDelta,
      });
    }
  });

  const previousFactors = new Set(previousSnapshot.healthFactorIds);
  const currentFactors = new Set(currentSnapshot.healthFactorIds);

  currentSnapshot.healthFactorIds.forEach((factorId) => {
    if (!previousFactors.has(factorId)) {
      events.push({ type: "health_factor_added", factorId });
    }
  });

  previousSnapshot.healthFactorIds.forEach((factorId) => {
    if (!currentFactors.has(factorId)) {
      events.push({ type: "health_factor_resolved", factorId });
    }
  });

  const hasMeaningfulChange = events.some((event) => {
    if (event.type === "health_score_unchanged") return false;
    if (
      event.type === "category_increased" ||
      event.type === "category_decreased"
    ) {
      return Math.abs(event.ratioDelta) >= MEANINGFUL_RATIO_DELTA;
    }
    return true;
  });

  return {
    previousSnapshot,
    currentSnapshot,
    totalAssetsDelta,
    assetCountDelta,
    monthlyContributionDelta,
    healthScoreDelta,
    categoryChanges,
    events,
    hasMeaningfulChange,
  };
}

export const portfolioSnapshotComparisonRules = {
  meaningfulRatioDelta: MEANINGFUL_RATIO_DELTA,
  meaningfulScoreDelta: MEANINGFUL_SCORE_DELTA,
};
