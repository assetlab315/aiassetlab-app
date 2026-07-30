export type DashboardTone = "blue" | "emerald" | "violet";

export type DashboardInsightState = "empty" | "warning" | "positive" | "neutral";

export type DashboardInsights = {
  summary: string;
  strength: string | null;
  warning: string | null;
  todayAction: string;
  actionLabel?: string;
  actionHref?: string;
  state: DashboardInsightState;
};

export type AssetHealthGrade = "A" | "B" | "C" | "D";

export type AssetHealthScoreFactor = {
  id: string;
  label: string;
  description: string;
  impact: number;
  type: "positive" | "negative" | "neutral";
};

export type AssetHealthScore = {
  score: number | null;
  grade: AssetHealthGrade | null;
  summary: string;
  factors: AssetHealthScoreFactor[];
  improvementPotential: number;
  state: "empty" | "warning" | "balanced" | "strong";
};

export type PortfolioReviewHighlight = {
  tone: "positive" | "neutral" | "caution";
  text: string;
};

export type PortfolioReview = {
  title: string;
  summary: string;
  highlights: PortfolioReviewHighlight[];
  nextAction: string;
  confidence: "high" | "medium";
};

export type DashboardAssetImpact = {
  label: string;
  title: string;
  description: string;
  mainAssetLabel: string;
  mainAssetRate: number;
  marketTheme: string;
  actionLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

export type DashboardTodayAi = {
  message: string;
};

export type DailyAdvisorPriority =
  | "empty"
  | "cash"
  | "monthly-investment"
  | "nisa"
  | "diversification"
  | "positive";

export type DailyAdvisor = {
  title: string;
  messages: string[];
  priority: DailyAdvisorPriority;
};

export type DashboardDailyCheck = {
  greeting: string;
  title: string;
  description: string;
  checkedTitle: string;
  checkedDescription: string;
  statusLabel: string;
  focusItems: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type DashboardTask = {
  step: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  tone: DashboardTone;
};

export type DashboardHabit = {
  title: string;
  description: string;
  checkedTitle: string;
  checkedDescription: string;
  statusLabel: string;
  ctaLabel: string;
  ctaHref: string;
};

export type DashboardPremiumPreview = {
  badgeLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};
