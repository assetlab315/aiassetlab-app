import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardHabit } from "../../features/dashboard/types";

type Props = {
  habit: DashboardHabit;
  isChecked: boolean;
};

export default function DashboardHabitCard({ habit, isChecked }: Props) {
  const title = isChecked ? habit.checkedTitle : habit.title;
  const description = isChecked ? habit.checkedDescription : habit.description;

  return (
    <Card className="border border-slate-100 bg-white">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-blue-600">毎日の習慣</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
              {isChecked ? "今日の確認済み" : habit.statusLabel}
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-black text-slate-900">{title}</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">{description}</p>
        </div>
        <Button href={habit.ctaHref} variant={isChecked ? "outline" : "secondary"}>
          {habit.ctaLabel}
        </Button>
      </div>
    </Card>
  );
}
