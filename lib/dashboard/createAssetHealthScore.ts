import type { PortfolioInsights } from "../../features/chat/types";
import type {
  AssetHealthGrade,
  AssetHealthScore,
  AssetHealthScoreFactor,
} from "../../features/dashboard/types";

type CreateAssetHealthScoreInput = {
  portfolioInsights: PortfolioInsights | null;
};

const BASE_SCORE = 60;

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getGrade(score: number): AssetHealthGrade {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 50) return "C";
  return "D";
}

function getState(score: number): AssetHealthScore["state"] {
  if (score >= 85) return "strong";
  if (score >= 70) return "balanced";
  return "warning";
}

function createFactor(
  id: string,
  label: string,
  description: string,
  impact: number,
): AssetHealthScoreFactor {
  return {
    id,
    label,
    description,
    impact,
    type: impact > 0 ? "positive" : impact < 0 ? "negative" : "neutral",
  };
}

function getSummary(score: number, factors: AssetHealthScoreFactor[]) {
  const positiveCount = factors.filter((factor) => factor.type === "positive").length;
  const negativeCount = factors.filter((factor) => factor.type === "negative").length;

  if (score >= 85) {
    return "資産配分と積立状況はおおむね整っています。無理な変更より継続を優先しましょう。";
  }

  if (negativeCount > 0 && positiveCount > 0) {
    return "良い土台はありますが、配分や積立状況に見直し余地があります。";
  }

  if (negativeCount > 0) {
    return "現在の資産配分には、確認しておきたい偏りがあります。";
  }

  return "資産形成の状態は大きく崩れていません。次は継続しやすさを確認しましょう。";
}

export function createAssetHealthScore({
  portfolioInsights,
}: CreateAssetHealthScoreInput): AssetHealthScore {
  if (!portfolioInsights) {
    return {
      score: null,
      grade: null,
      summary: "資産を登録すると、配分と積立状況からスコアを確認できます。",
      factors: [],
      improvementPotential: 0,
      state: "empty",
    };
  }

  const factors: AssetHealthScoreFactor[] = [];
  let concentrationPenaltyApplied = false;

  if (
    portfolioInsights.investmentCount === 1 &&
    portfolioInsights.concentration !== "none"
  ) {
    factors.push(
      createFactor(
        "single-asset-concentration",
        "単一資産への集中",
        "1つの資産の値動きが全体へ強く影響します。",
        -20,
      ),
    );
    concentrationPenaltyApplied = true;
  }

  if (portfolioInsights.cryptoRatio >= 70) {
    factors.push(
      createFactor(
        "crypto-concentration",
        "暗号資産への集中",
        "価格変動の影響を受けやすい配分です。",
        -15,
      ),
    );
    concentrationPenaltyApplied = true;
  } else if (portfolioInsights.cryptoRatio >= 50) {
    factors.push(
      createFactor(
        "crypto-concentration",
        "暗号資産への集中",
        "価格変動の影響を受けやすい配分です。",
        -10,
      ),
    );
    concentrationPenaltyApplied = true;
  } else if (portfolioInsights.cryptoRatio >= 30) {
    factors.push(
      createFactor(
        "crypto-ratio",
        "暗号資産比率が高め",
        "値動きの大きい資産がやや多い状態です。",
        -5,
      ),
    );
  }

  if (portfolioInsights.cashRatio >= 85) {
    factors.push(
      createFactor(
        "cash-ratio",
        "現金比率が高め",
        "長期運用へ回る資金が限られている可能性があります。",
        -10,
      ),
    );
    concentrationPenaltyApplied = true;
  } else if (portfolioInsights.cashRatio >= 70) {
    factors.push(
      createFactor(
        "cash-ratio",
        "現金比率が高め",
        "長期運用へ回る資金が限られている可能性があります。",
        -5,
      ),
    );
    concentrationPenaltyApplied = true;
  }

  if (!concentrationPenaltyApplied) {
    if (
      portfolioInsights.concentration === "over90" ||
      portfolioInsights.concentration === "over70"
    ) {
      factors.push(
        createFactor(
          "asset-concentration",
          "特定資産への偏り",
          "一部の資産の値動きが全体へ影響しやすい状態です。",
          portfolioInsights.concentration === "over90" ? -10 : -5,
        ),
      );
      concentrationPenaltyApplied = true;
    }
  }

  if (!concentrationPenaltyApplied) {
    if (
      portfolioInsights.diversification === "Excellent" ||
      portfolioInsights.diversification === "Good"
    ) {
      factors.push(
        createFactor(
          "diversification",
          "複数カテゴリへの分散",
          "特定の資産だけに依存しにくい配分です。",
          15,
        ),
      );
    } else if (portfolioInsights.diversification === "Poor") {
      factors.push(
        createFactor(
          "diversification",
          "分散が不足",
          "資産カテゴリが少なく、値動きが偏りやすい状態です。",
          -10,
        ),
      );
    } else if (portfolioInsights.diversification === "Moderate") {
      factors.push(
        createFactor(
          "diversification",
          "分散が限定的",
          "複数カテゴリへの分散を広げる余地があります。",
          -5,
        ),
      );
    }
  }

  if (portfolioInsights.monthlyInvestment > 0) {
    factors.push(
      createFactor(
        "monthly-investment",
        "毎月の積立",
        "継続的な資産形成の仕組みがあります。",
        10,
      ),
    );
  } else {
    factors.push(
      createFactor(
        "monthly-investment",
        "積立が未設定",
        "継続的な資産形成の計画を設定する余地があります。",
        -5,
      ),
    );
  }

  const rawScore = BASE_SCORE + factors.reduce((sum, factor) => sum + factor.impact, 0);
  const score = clampScore(rawScore);
  const improvementPotential = factors
    .filter((factor) => factor.type === "negative")
    .reduce((sum, factor) => sum + Math.abs(factor.impact), 0);

  return {
    score,
    grade: getGrade(score),
    summary: getSummary(score, factors),
    factors,
    improvementPotential,
    state: getState(score),
  };
}

export const assetHealthScoreRules = {
  baseScore: BASE_SCORE,
  gradeThresholds: {
    A: 85,
    B: 70,
    C: 50,
    D: 0,
  },
};
