import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "診断する",
  description: "5つの質問で資産形成の現在地を整理し、今日の一歩を決めます。",
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
