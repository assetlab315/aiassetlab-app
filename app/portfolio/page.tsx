import PortfolioClient from "../../components/portfolio/PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "資産を見る",
  description: "保有資産と毎月の積立額を登録し、資産形成の現在地を整理します。",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
