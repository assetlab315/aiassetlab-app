export type DashboardTone = "blue" | "emerald" | "violet";

export type DashboardAdvice = {
  label: string;
  title: string;
  description: string;
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
