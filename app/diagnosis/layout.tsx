import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI資産形成診断",
  description: "5つの質問で投資経験、リスク許容度、積立額を整理し、資産形成で今日やることを決めます。",
  alternates: {
    canonical: "/diagnosis",
  },
};

export default function DiagnosisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
