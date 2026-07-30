import { ChartNoAxesColumn } from "lucide-react";
import Button from "../ui/Button";

export default function EmptyDashboard() {
  return (
    <section
      aria-labelledby="empty-dashboard-title"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
            >
              <ChartNoAxesColumn className="h-5 w-5" />
            </span>
            <h2 id="empty-dashboard-title" className="text-xl font-black text-slate-900">
              資産を登録しましょう
            </h2>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            まずは現金だけでも登録すると、AIによる分析を始められます。
          </p>
        </div>
        <Button href="/portfolio" className="w-full sm:w-auto">
          資産を登録
        </Button>
      </div>
    </section>
  );
}
