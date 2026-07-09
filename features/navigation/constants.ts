import type { FeatureNavItem } from "./types";

export const FEATURE_NAV_ITEMS: FeatureNavItem[] = [
  {
    label: "ホーム",
    description: "今日の判断と次の一歩を確認する",
    href: "/dashboard",
  },
  {
    label: "資産登録",
    description: "保有資産と毎月積立を更新する",
    href: "/portfolio",
  },
  {
    label: "将来シミュレーション",
    description: "今のペースで将来いくらになるか見る",
    href: "/simulator",
  },
  {
    label: "AI相談",
    description: "迷ったことを短くAIに聞く",
    href: "/chat",
  },
];
