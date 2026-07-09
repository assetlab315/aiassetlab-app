import { MVP_PROGRESS_ITEMS } from "../../features/mvp/constants";

export default function MvpProgressCard() {
  const completedCount = MVP_PROGRESS_ITEMS.filter((item) => item.done).length;
  const progressRate = Math.round((completedCount / MVP_PROGRESS_ITEMS.length) * 100);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">MVP進捗</h2>
      <p className="mt-2 text-sm text-slate-500">
        主要機能は実装済みです。次は使いやすさの磨き込みに入ります。
      </p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-slate-700">完成度</span>
          <span className="font-bold text-blue-600">{progressRate}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-blue-600"
            style={{ width: `${progressRate}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {MVP_PROGRESS_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{item.label}</span>
            <span className={item.done ? "font-semibold text-blue-600" : "text-slate-400"}>
              {item.done ? "完了" : "未完了"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
