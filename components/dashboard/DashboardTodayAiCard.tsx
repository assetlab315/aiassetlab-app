import Card from "../ui/Card";
import type { DashboardTodayAi } from "../../features/dashboard/types";

type Props = {
  todayAi: DashboardTodayAi;
};

export default function DashboardTodayAiCard({ todayAi }: Props) {
  return (
    <Card className="border border-blue-100 bg-white">
      <p className="text-sm font-black text-blue-600">今日のAI</p>
      <p className="mt-3 text-2xl font-black leading-snug text-slate-900">
        {todayAi.message}
      </p>
    </Card>
  );
}
