export type DashboardTone = "blue" | "emerald" | "violet";

export type DashboardAdvice = {
  label: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export type DashboardInsight = {
  label: string;
  title: string;
  description: string;
  impactLabel: string;
  impactLevel: 0 | 1 | 2 | 3;
  primaryPoint: string;
  secondaryPoint: string;
  ctaLabel: string;
  ctaHref: string;
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
  statusLabel: string;
};


export type DashboardPremiumPreview = {
  badgeLabel: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};
