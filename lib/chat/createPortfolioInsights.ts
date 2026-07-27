import type {
  PortfolioContextAsset,
  PortfolioInsightCategory,
  PortfolioInsightRatio,
  PortfolioInsights,
} from "../../features/chat/types";

const CATEGORY_LABELS: Record<PortfolioInsightCategory, string> = {
  cash: "現金",
  stock: "株式",
  fund: "投資信託",
  etf: "ETF",
  reit: "REIT",
  bond: "債券",
  crypto: "暗号資産",
  gold: "金",
  other: "その他",
};

function formatYen(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function toPercent(value: number) {
  return Math.round(value);
}

function normalizeCategory(asset: PortfolioContextAsset): PortfolioInsightCategory {
  const category = `${asset.category || ""}`.toLowerCase();
  const name = `${asset.name || ""}`.toLowerCase();

  if (category === "cash" || category.includes("現金") || category.includes("預金")) {
    return "cash";
  }
  if (category === "crypto" || category.includes("暗号") || category.includes("仮想通貨")) {
    return "crypto";
  }
  if (category === "stock" || category.includes("株式") || category.includes("個別株")) {
    return "stock";
  }
  if (category === "fund" || category.includes("投資信託") || category.includes("nisa")) {
    return "fund";
  }
  if (category === "other" || category === "pension" || category === "未分類") {
    if (name.includes("reit") || name.includes("リート")) return "reit";
    if (name.includes("etf")) return "etf";
    if (name.includes("bond") || name.includes("債券")) return "bond";
    if (name.includes("gold") || name.includes("金")) return "gold";
    if (name.includes("暗号") || name.includes("仮想通貨")) return "crypto";
    if (name.includes("投資信託") || name.includes("nisa")) return "fund";
    if (name.includes("株")) return "stock";
  }

  return "other";
}

function getRatioLevel(
  ratio: number,
  highThreshold: number,
  lowThreshold: number,
): "high" | "normal" | "low" | "none" {
  if (ratio <= 0) return "none";
  if (ratio >= highThreshold) return "high";
  if (ratio <= lowThreshold) return "low";
  return "normal";
}

function getCryptoLevel(ratio: number): PortfolioInsights["cryptoLevel"] {
  if (ratio <= 0) return "none";
  return ratio >= 20 ? "high" : "normal";
}

function getConcentration(largestAssetRatio: number): PortfolioInsights["concentration"] {
  if (largestAssetRatio >= 90) return "over90";
  if (largestAssetRatio >= 70) return "over70";
  if (largestAssetRatio >= 50) return "over50";
  return "none";
}

function getDiversification(
  categoryRatios: PortfolioInsightRatio[],
  concentration: PortfolioInsights["concentration"],
): PortfolioInsights["diversification"] {
  const activeCategoryCount = categoryRatios.filter((ratio) => ratio.amount > 0).length;

  if (concentration === "over90" || activeCategoryCount <= 1) return "Poor";
  if (concentration === "over70") return "Moderate";
  if (activeCategoryCount >= 4 && concentration === "none") return "Excellent";
  if (activeCategoryCount >= 2) return "Good";
  return "Moderate";
}

function getRiskLevel(
  stockRatio: number,
  cryptoRatio: number,
  concentration: PortfolioInsights["concentration"],
): PortfolioInsights["riskLevel"] {
  if (cryptoRatio >= 30 || stockRatio >= 80 || concentration === "over90") return "high";
  if (cryptoRatio >= 10 || stockRatio >= 50 || concentration === "over70") return "medium";
  return "low";
}

export function createPortfolioInsights(
  assets: PortfolioContextAsset[],
): PortfolioInsights | null {
  const validAssets = assets.filter((asset) => (asset.amount || 0) > 0);
  const totalAssets = validAssets.reduce((sum, asset) => sum + (asset.amount || 0), 0);

  if (validAssets.length === 0 || totalAssets <= 0) {
    return null;
  }

  const categoryAmounts = validAssets.reduce<Record<PortfolioInsightCategory, number>>(
    (amounts, asset) => {
      const category = normalizeCategory(asset);
      amounts[category] += asset.amount || 0;
      return amounts;
    },
    {
      cash: 0,
      stock: 0,
      fund: 0,
      etf: 0,
      reit: 0,
      bond: 0,
      crypto: 0,
      gold: 0,
      other: 0,
    },
  );

  const categoryRatios = Object.entries(categoryAmounts).map(([category, amount]) => {
    const ratio = totalAssets === 0 ? 0 : (amount / totalAssets) * 100;
    const label = CATEGORY_LABELS[category as PortfolioInsightCategory];

    return {
      category: category as PortfolioInsightCategory,
      label,
      amount,
      ratio,
      description: `${label}${toPercent(ratio)}%`,
    };
  });

  const largestAssetRatio = Math.max(
    ...validAssets.map((asset) => ((asset.amount || 0) / totalAssets) * 100),
  );
  const stockRatio = categoryAmounts.stock + categoryAmounts.fund + categoryAmounts.etf;
  const cashRatio = categoryAmounts.cash;
  const cryptoRatio = categoryAmounts.crypto;
  const bondRatio = categoryAmounts.bond;
  const concentration = getConcentration(largestAssetRatio);
  const diversification = getDiversification(categoryRatios, concentration);
  const cashLevel = getRatioLevel((cashRatio / totalAssets) * 100, 60, 10);
  const stockLevel = getRatioLevel((stockRatio / totalAssets) * 100, 70, 20);
  const cryptoLevel = getCryptoLevel((cryptoRatio / totalAssets) * 100);
  const monthlyInvestment = validAssets.reduce(
    (sum, asset) => sum + (asset.monthlyContribution || 0),
    0,
  );
  const riskLevel = getRiskLevel(
    (stockRatio / totalAssets) * 100,
    (cryptoRatio / totalAssets) * 100,
    concentration,
  );
  const warnings: string[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  if (concentration === "over90") {
    warnings.push("1つの資産にほぼ集中しています");
    recommendations.push("新規積立は分散投資を優先すると良いでしょう");
  } else if (concentration === "over70") {
    warnings.push("集中投資の傾向があります");
    recommendations.push("資産カテゴリを分けることを検討しましょう");
  } else if (concentration === "over50") {
    warnings.push("1資産の比率が高めです");
  }

  if (cashLevel === "high") {
    strengths.push("現金比率が高めです");
    recommendations.push("積立投資を段階的に検討できます");
  }
  if (cashLevel === "low") {
    warnings.push("現金比率が低めです");
    recommendations.push("生活防衛資金を確認しましょう");
  }
  if (cryptoLevel === "high") {
    warnings.push("暗号資産比率が高めです");
    recommendations.push("新規積立では分散を優先しましょう");
  }
  if (diversification === "Excellent" || diversification === "Good") {
    strengths.push("分散投資が進んでいます");
  } else if (diversification === "Poor") {
    warnings.push("分散が不足しています");
    recommendations.push("低コストの分散型資産を検討しましょう");
  }
  if (monthlyInvestment > 0) {
    strengths.push("毎月の積立習慣があります");
  } else {
    recommendations.push("無理のない少額積立から始める選択肢があります");
  }

  return {
    totalAssets,
    totalAssetsDescription: `総資産${formatYen(totalAssets)}`,
    categoryRatios,
    cashRatio: (cashRatio / totalAssets) * 100,
    cashLevel,
    stockRatio: (stockRatio / totalAssets) * 100,
    stockLevel,
    bondRatio: (bondRatio / totalAssets) * 100,
    cryptoRatio: (cryptoRatio / totalAssets) * 100,
    cryptoLevel,
    diversification,
    concentration,
    largestAssetRatio,
    investmentCount: validAssets.length,
    monthlyInvestment,
    monthlyInvestmentDescription: `毎月積立${formatYen(monthlyInvestment)}`,
    riskLevel,
    warnings: Array.from(new Set(warnings)).slice(0, 3),
    strengths: Array.from(new Set(strengths)).slice(0, 3),
    recommendations: Array.from(new Set(recommendations)).slice(0, 3),
  };
}
