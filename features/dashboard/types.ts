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
