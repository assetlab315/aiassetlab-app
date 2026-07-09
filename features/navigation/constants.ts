import type { FeatureNavItem } from "./types";

export const FEATURE_NAV_ITEMS: FeatureNavItem[] = [
  {
    label: "Dashboard",
    description: "今日やることを見る",
    href: "/dashboard",
  },
  {
    label: "Portfolio",
    description: "資産状況を確認する",
    href: "/portfolio",
  },
  {
    label: "Simulator",
    description: "将来資産を試算する",
    href: "/simulator",
  },
  {
    label: "AI Chat",
    description: "AIに相談する",
    href: "/chat",
  },
];
