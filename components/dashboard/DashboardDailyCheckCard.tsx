import Button from "../ui/Button";
import Card from "../ui/Card";
import type { DashboardDailyCheck } from "../../features/dashboard/types";

type Props = {
  dailyCheck: DashboardDailyCheck;
  dateLabel: string;
  isChecked: boolean;
  onCheck: () => void;
};

export default function DashboardDailyCheckCard({
  dailyCheck,
  dateLabel,
  isChecked,
  onCheck,
}: Props) {
  return (
    <Card className="border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-blue-50">
              {dateLabel}
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-blue-50">
              {isChecked ? "今日の確認済み" : dailyCheck.statusLabel}
            </span>
          </div>

          <p className="mt-5 text-sm font-black text-blue-100">
            {dailyCheck.greeting}
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-4xl">
            {isChecked ? dailyCheck.checkedTitle : dailyCheck.title}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-blue-50">
            {isChecked ? dailyCheck.checkedDescription : dailyCheck.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onCheck}
              variant="secondary"
              className="bg-white text-blue-700 hover:bg-blue-50"
            >
              {isChecked ? "確認済み" : "今日の確認をする"}
            </Button>
            <Button
              href={dailyCheck.ctaHref}
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-blue-700"
            >
              {dailyCheck.ctaLabel}
            </Button>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-white/10 p-5 backdrop-blur">
          <p className="text-xs font-black text-blue-100">今日見るポイント</p>
          <div className="mt-4 space-y-3">
            {dailyCheck.focusItems.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4">
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-blue-700">
                  {isChecked ? "✓" : index + 1}
                </span>
                <p className="text-sm font-black leading-6 text-white">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-blue-50">
            {isChecked
              ? "今日の確認は完了です。次は必要なときだけAIに相談しましょう。"
              : "上から3つ見るだけで大丈夫です。大きな判断は急がなくて構いません。"}
          </p>
        </div>
      </div>
    </Card>
  );
}
