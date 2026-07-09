import DashboardClient from "../../components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "資産サマリー、今日のAI、今日やることをまとめて確認できます。",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
