import type { MvpFeature, MvpProgressItem } from "./types";

export const MVP_FEATURES: MvpFeature[] = [
  {
    step: "Step 1",
    title: "AI診断",
    description: "ユーザーの現在地を整理し、資産形成の入口を作ります。",
    action: "まず診断する",
    href: "/diagnosis",
  },
  {
    step: "Step 2",
    title: "AI Dashboard",
    description: "診断結果、今日の行動、次に使う機能をまとめて確認します。",
    action: "今日の行動を見る",
    href: "/dashboard",
  },
  {
    step: "Step 3",
    title: "Portfolio",
    description: "現在の資産状況と配分をシンプルに把握します。",
    action: "資産状況を見る",
    href: "/portfolio",
  },
  {
    step: "Step 4",
    title: "Simulator",
    description: "毎月の積立額から将来の資産額を試算します。",
    action: "将来を試算する",
    href: "/simulator",
  },
  {
    step: "Step 5",
    title: "AI Chat",
    description: "資産形成やAI活用について、次の行動に絞って相談します。",
    action: "AIに相談する",
    href: "/chat",
  },
];

export const MVP_PROGRESS_ITEMS: MvpProgressItem[] = [
  { label: "AI診断", done: true },
  { label: "AI Dashboard", done: true },
  { label: "Portfolio", done: true },
  { label: "Simulator", done: true },
  { label: "AI Chat", done: true },
];
