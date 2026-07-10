import PortfolioClient from "../../components/portfolio/PortfolioClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "資産を登録して見る",
  description: "保有資産と毎月の積立額を登録し、資産合計と配分から資産形成の現在地を見える化します。",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
