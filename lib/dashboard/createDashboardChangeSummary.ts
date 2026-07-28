import type { AssetHealthScore, DashboardInsights } from "../../features/dashboard/types";
import type {
  DashboardChangeItem,
  DashboardChangeSummary,
  PortfolioChangeEvent,
  PortfolioSnapshotComparison,
} from "../../features/portfolio-history/types";

type CreateDashboardChangeSummaryInput = {
  comparison: PortfolioSnapshotComparison | null;
  currentDashboardInsights: DashboardInsights;
  currentHealthScore: AssetHealthScore;
};

const categoryLabels: Record<string, string> = {
  cash: "現金",
  stock: "株式",
  fund: "投資信託",
  etf: "ETF",
  reit: "REIT",
  bond: "債券",
  crypto: "暗号資産",
  gold: "金",
  pension: "年金",
  other: "その他",
};

const factorLabels: Record<string, string> = {
  "asset-concentration": "特定資産への偏り",
  "cash-ratio": "現金比率が高め",
  "crypto-concentration": "暗号資産への集中",
  "crypto-ratio": "暗号資産比率が高め",
  diversification: "分散状態",
  "monthly-investment": "毎月の積立",
  "single-asset-concentration": "単一資産への集中",
};

function formatComparedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const isSameYear = now.getFullYear() === date.getFullYear();

  return new Intl.DateTimeFormat("ja-JP", {
    year: isSameYear ? undefined : "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function createItem(
  id: string,
  label: string,
  tone: DashboardChangeItem["tone"],
  priority: number,
  description?: string,
): DashboardChangeItem {
  return {
    id,
    label,
    tone,
    priority,
    ...(description ? { description } : {}),
  };
}

function findEvent<T extends PortfolioChangeEvent["type"]>(
  events: PortfolioChangeEvent[],
  type: T,
) {
  return events.find((event) => event.type === type) as
    | Extract<PortfolioChangeEvent, { type: T }>
    | undefined;
}

function getFactorLabel(factorId: string) {
  return factorLabels[factorId] ?? "確認したい要因";
}

function createChangeItems(comparison: PortfolioSnapshotComparison) {
  const positiveChanges: DashboardChangeItem[] = [];
  const cautionChanges: DashboardChangeItem[] = [];
  const neutralChanges: DashboardChangeItem[] = [];
  const events = comparison.events;

  const addedFactors = events.filter((event) => event.type === "health_factor_added");
  const resolvedFactors = events.filter((event) => event.type === "health_factor_resolved");
  const hasAddedCryptoFactor = addedFactors.some(
    (event) =>
      event.factorId === "crypto-concentration" || event.factorId === "crypto-ratio",
  );
  const hasResolvedSingleAsset = resolvedFactors.some(
    (event) => event.factorId === "single-asset-concentration",
  );

  const contributionStarted = findEvent(events, "contribution_started");
  const contributionStopped = findEvent(events, "contribution_stopped");
  const contributionChanged = findEvent(events, "contribution_changed");
  const scoreIncreased = findEvent(events, "health_score_increased");
  const scoreDecreased = findEvent(events, "health_score_decreased");

  if (hasAddedCryptoFactor) {
    cautionChanges.push(
      createItem(
        "crypto-factor-added",
        "暗号資産への偏りが大きくなっています。",
        "caution",
        100,
        "今後の積立先を分散すると、配分を整えやすくなります。",
      ),
    );
  }

  const addedSingleAsset = addedFactors.find(
    (event) => event.factorId === "single-asset-concentration",
  );
  if (addedSingleAsset) {
    cautionChanges.push(
      createItem(
        "single-asset-factor-added",
        "単一資産への集中が新たに見られます。",
        "caution",
        95,
        "1つの資産の値動きが全体へ影響しやすい状態です。",
      ),
    );
  }

  if (contributionStopped) {
    cautionChanges.push(
      createItem(
        "contribution-stopped",
        "毎月の積立が停止しています。",
        "caution",
        90,
      ),
    );
  }

  if (scoreDecreased && !hasAddedCryptoFactor && !addedSingleAsset) {
    cautionChanges.push(
      createItem(
        "score-decreased",
        `Health Scoreが${Math.abs(scoreDecreased.delta)}ポイント低下しました。`,
        "caution",
        80,
      ),
    );
  }

  if (hasResolvedSingleAsset) {
    positiveChanges.push(
      createItem(
        "single-asset-factor-resolved",
        "単一資産への集中が解消されました。",
        "positive",
        95,
      ),
    );
  }

  const resolvedCryptoFactor = resolvedFactors.find(
    (event) =>
      event.factorId === "crypto-concentration" || event.factorId === "crypto-ratio",
  );
  if (resolvedCryptoFactor) {
    positiveChanges.push(
      createItem(
        "crypto-factor-resolved",
        "暗号資産への偏りが小さくなりました。",
        "positive",
        90,
      ),
    );
  }

  if (contributionStarted) {
    positiveChanges.push(
      createItem(
        "contribution-started",
        "毎月の積立を開始しました。",
        "positive",
        85,
      ),
    );
  } else if (contributionChanged) {
    neutralChanges.push(
      createItem(
        "contribution-changed",
        "毎月の積立額が変わりました。",
        "neutral",
        55,
      ),
    );
  }

  if (scoreIncreased && positiveChanges.length === 0) {
    positiveChanges.push(
      createItem(
        "score-increased",
        `Health Scoreが${scoreIncreased.delta}ポイント上昇しました。`,
        "positive",
        75,
      ),
    );
  }

  addedFactors
    .filter(
      (event) =>
        event.factorId !== "single-asset-concentration" &&
        event.factorId !== "crypto-concentration" &&
        event.factorId !== "crypto-ratio" &&
        event.factorId !== "monthly-investment" &&
        event.factorId !== "diversification",
    )
    .forEach((event) => {
      cautionChanges.push(
        createItem(
          `added-${event.factorId}`,
          `${getFactorLabel(event.factorId)}を確認しましょう。`,
          "caution",
          58,
        ),
      );
    });

  if (!hasAddedCryptoFactor) {
    const cryptoIncrease = events.find(
      (event) =>
        event.type === "category_increased" &&
        event.category === "crypto" &&
        event.ratioDelta >= 5,
    );
    if (cryptoIncrease?.type === "category_increased") {
      cautionChanges.push(
        createItem(
          "crypto-ratio-increased",
          `暗号資産比率が${cryptoIncrease.ratioDelta}ポイント上昇しました。`,
          "caution",
          45,
        ),
      );
    }
  }

  const categoryEvent = events.find(
    (event) =>
      (event.type === "category_increased" || event.type === "category_decreased") &&
      event.category !== "crypto" &&
      Math.abs(event.ratioDelta) >= 5,
  );
  if (categoryEvent?.type === "category_increased") {
    neutralChanges.push(
      createItem(
        `category-increased-${categoryEvent.category}`,
        `${categoryLabels[categoryEvent.category] ?? categoryEvent.category}比率が${categoryEvent.ratioDelta}ポイント上昇しました。`,
        "neutral",
        30,
      ),
    );
  } else if (categoryEvent?.type === "category_decreased") {
    neutralChanges.push(
      createItem(
        `category-decreased-${categoryEvent.category}`,
        `${categoryLabels[categoryEvent.category] ?? categoryEvent.category}比率が${Math.abs(categoryEvent.ratioDelta)}ポイント低下しました。`,
        "neutral",
        30,
      ),
    );
  }

  return {
    positiveChanges: positiveChanges.sort((a, b) => b.priority - a.priority),
    cautionChanges: cautionChanges.sort((a, b) => b.priority - a.priority),
    neutralChanges: neutralChanges.sort((a, b) => b.priority - a.priority),
  };
}

function limitItems(
  positiveChanges: DashboardChangeItem[],
  cautionChanges: DashboardChangeItem[],
  neutralChanges: DashboardChangeItem[],
) {
  const selected = [...cautionChanges, ...positiveChanges, ...neutralChanges]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  return {
    positiveChanges: positiveChanges.filter((item) =>
      selected.some((selectedItem) => selectedItem.id === item.id),
    ),
    cautionChanges: cautionChanges.filter((item) =>
      selected.some((selectedItem) => selectedItem.id === item.id),
    ),
    neutralChanges: neutralChanges.filter((item) =>
      selected.some((selectedItem) => selectedItem.id === item.id),
    ),
  };
}

export function createDashboardChangeSummary({
  comparison,
  currentDashboardInsights,
  currentHealthScore,
}: CreateDashboardChangeSummaryInput): DashboardChangeSummary {
  if (!comparison) {
    return {
      state: "no_history",
      title: "比較できる記録はまだありません。",
      summary: "資産を更新すると、次回から前回の資産状況との変化を確認できます。",
      scoreDelta: null,
      comparedAt: null,
      positiveChanges: [],
      cautionChanges: [],
      neutralChanges: [],
    };
  }

  const comparedAt = formatComparedAt(comparison.previousSnapshot.createdAt);
  const scoreDelta = comparison.healthScoreDelta;

  if (!comparison.hasMeaningfulChange) {
    return {
      state: "no_change",
      title: "前回の記録から大きな変化はありません。",
      summary: currentDashboardInsights.todayAction,
      scoreDelta,
      comparedAt,
      positiveChanges: [],
      cautionChanges: [],
      neutralChanges: [],
    };
  }

  const changeItems = createChangeItems(comparison);
  const { positiveChanges, cautionChanges, neutralChanges } = limitItems(
    changeItems.positiveChanges,
    changeItems.cautionChanges,
    changeItems.neutralChanges,
  );

  const hasPositive = positiveChanges.length > 0;
  const hasCaution = cautionChanges.length > 0;
  const state = hasPositive && hasCaution
    ? "mixed"
    : hasCaution
      ? "needs_attention"
      : "improved";

  const titleByState: Record<DashboardChangeSummary["state"], string> = {
    improved: "前回から改善しています。",
    mixed: "良い変化と確認したい変化があります。",
    needs_attention: "配分に確認したい変化があります。",
    no_change: "前回の記録から大きな変化はありません。",
    no_history: "比較できる記録はまだありません。",
  };

  const summaryByState: Record<DashboardChangeSummary["state"], string> = {
    improved:
      scoreDelta !== null && scoreDelta >= 5
        ? `Health Scoreが${scoreDelta}ポイント上昇しました。`
        : "分散や積立の状態に良い変化があります。",
    mixed:
      scoreDelta !== null
        ? `Health Scoreは${scoreDelta >= 0 ? "+" : ""}${scoreDelta}ポイントです。現在の注意点も一緒に確認しましょう。`
        : currentHealthScore.summary,
    needs_attention:
      scoreDelta !== null && scoreDelta <= -5
        ? `Health Scoreが${Math.abs(scoreDelta)}ポイント低下しました。`
        : "現在の配分で確認したい点が出ています。",
    no_change: currentDashboardInsights.todayAction,
    no_history: "資産を更新すると、次回から前回の資産状況との変化を確認できます。",
  };

  return {
    state,
    title: titleByState[state],
    summary: summaryByState[state],
    scoreDelta,
    comparedAt,
    positiveChanges,
    cautionChanges,
    neutralChanges,
  };
}
