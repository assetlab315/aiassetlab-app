import DashboardClient from "../../components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "資産形成Dashboard",
  description: "登録資産、今日のAI、今日やることを1画面で確認し、資産形成の行動を続けやすくします。",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
