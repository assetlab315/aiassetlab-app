import type { PortfolioInsights } from "../../features/chat/types";
import type {
  AssetHealthScore,
  DashboardInsights,
  PortfolioReview,
  PortfolioReviewHighlight,
} from "../../features/dashboard/types";
import type { DashboardChangeSummary } from "../../features/portfolio-history/types";

type CreatePortfolioReviewInput = {
  portfolioInsights: PortfolioInsights | null;
  dashboardInsights: DashboardInsights;
  assetHealthScore: AssetHealthScore | null;
  portfolioChangeSummary: DashboardChangeSummary | null;
};

const forbiddenWords = ["絶対", "必ず", "失敗", "危険", "儲かる", "買うべき", "売るべき", "あなたは"];

function cleanText(value: string) {
  return forbiddenWords.reduce((text, word) => text.split(word).join(""), value).trim();
}

function createHighlight(
  tone: PortfolioReviewHighlight["tone"],
  text: string,
): PortfolioReviewHighlight {
  return {
    tone,
    text: cleanText(text),
  };
}

function uniqueHighlights(highlights: PortfolioReviewHighlight[]) {
  const seen = new Set<string>();
  return highlights
    .filter((highlight) => {
      if (seen.has(highlight.text)) return false;
      seen.add(highlight.text);
      return true;
    })
    .slice(0, 3);
}

function getHealthHighlight(assetHealthScore: AssetHealthScore | null) {
  if (!assetHealthScore || assetHealthScore.score === null) return null;

  if (assetHealthScore.score < 50) {
    return createHighlight("caution", "配分の偏りを確認したい状態です。");
  }

  if (assetHealthScore.score >= 85) {
    return createHighlight("positive", "資産配分と積立状況はおおむね整っています。");
  }

  if (assetHealthScore.score >= 70) {
    return createHighlight("positive", "資産形成の土台は安定しています。");
  }

  return createHighlight("neutral", "改善余地を見ながら整えていけます。");
}

function getPortfolioHighlights(portfolioInsights: PortfolioInsights) {
  const highlights: PortfolioReviewHighlight[] = [];

  if (portfolioInsights.cryptoLevel === "high") {
    highlights.push(createHighlight("caution", "暗号資産への偏りが大きめです。"));
  }

  if (
    portfolioInsights.concentration === "over90" ||
    portfolioInsights.concentration === "over70"
  ) {
    highlights.push(createHighlight("caution", "特定資産への集中が見られます。"));
  }

  if (portfolioInsights.cashLevel === "high") {
    highlights.push(createHighlight("caution", "現金比率がやや高めです。"));
  }

  if (
    portfolioInsights.diversification === "Excellent" ||
    portfolioInsights.diversification === "Good"
  ) {
    highlights.push(createHighlight("positive", "複数カテゴリへの分散が進んでいます。"));
  }

  if (portfolioInsights.monthlyInvestment > 0) {
    highlights.push(createHighlight("positive", "毎月の積立を続ける形ができています。"));
  } else {
    highlights.push(createHighlight("neutral", "毎月の積立額を設定する余地があります。"));
  }

  return highlights;
}

function getChangeHighlights(changeSummary: DashboardChangeSummary | null) {
  if (!changeSummary) return [];

  return [
    ...changeSummary.positiveChanges.map((item) => createHighlight("positive", item.label)),
    ...changeSummary.cautionChanges.map((item) => createHighlight("caution", item.label)),
    ...changeSummary.neutralChanges.map((item) => createHighlight("neutral", item.label)),
  ];
}

function getSummary(
  portfolioInsights: PortfolioInsights | null,
  dashboardInsights: DashboardInsights,
  assetHealthScore: AssetHealthScore | null,
  changeSummary: DashboardChangeSummary | null,
) {
  if (!portfolioInsights) {
    return "資産が登録されると、配分や積立状況を分析し、レビューを表示します。";
  }

  if (!changeSummary || changeSummary.state === "no_history") {
    return "現在のPortfolioを基準として、次回から変化もレビューします。";
  }

  if (changeSummary.state === "improved") {
    return "前回から改善が見られます。積立や配分の変化が良い方向に働いています。";
  }

  if (changeSummary.state === "mixed") {
    return "改善した点と、確認したい点があります。今の注意点を見ながら整えていきましょう。";
  }

  if (changeSummary.state === "needs_attention") {
    return "配分の偏りがやや大きくなっています。今後の積立先を分散すると改善しやすくなります。";
  }

  if (changeSummary.state === "no_change") {
    return "前回から大きな変化はありません。現在の積立を継続しながら、定期的に配分を確認しましょう。";
  }

  if (assetHealthScore?.score !== null && assetHealthScore && assetHealthScore.score < 50) {
    return "現在のPortfolioには確認したい偏りがあります。まずは次の積立先を分散することを検討してみましょう。";
  }

  return dashboardInsights.summary;
}

function getNextAction(
  portfolioInsights: PortfolioInsights | null,
  dashboardInsights: DashboardInsights,
) {
  if (!portfolioInsights) {
    return "まずはPortfolioで現在の資産を1件登録してみましょう。";
  }

  return dashboardInsights.todayAction;
}

export function createPortfolioReview({
  portfolioInsights,
  dashboardInsights,
  assetHealthScore,
  portfolioChangeSummary,
}: CreatePortfolioReviewInput): PortfolioReview {
  const summary = cleanText(
    getSummary(portfolioInsights, dashboardInsights, assetHealthScore, portfolioChangeSummary),
  );

  if (!portfolioInsights) {
    return {
      title: "今回のレビュー",
      summary,
      highlights: [
        createHighlight("neutral", "資産登録後に配分と積立状況を確認できます。"),
      ],
      nextAction: getNextAction(portfolioInsights, dashboardInsights),
      confidence: "medium",
    };
  }

  const healthHighlight = getHealthHighlight(assetHealthScore);
  const highlights = uniqueHighlights([
    ...getChangeHighlights(portfolioChangeSummary),
    ...(healthHighlight ? [healthHighlight] : []),
    ...getPortfolioHighlights(portfolioInsights),
  ]);

  return {
    title: "今回のレビュー",
    summary,
    highlights,
    nextAction: cleanText(getNextAction(portfolioInsights, dashboardInsights)),
    confidence:
      !portfolioChangeSummary || portfolioChangeSummary.state === "no_history"
        ? "medium"
        : "high",
  };
}
