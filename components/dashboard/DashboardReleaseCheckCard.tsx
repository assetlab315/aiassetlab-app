import Card from "../ui/Card";

const releaseCheckItems = [
  {
    label: "資産の確認",
    description: "登録済みの資産数、合計額、毎月の積立額が見える状態です。",
  },
  {
    label: "次の行動",
    description: "資産登録、将来シミュレーション、AI相談への導線を迷わず選べます。",
  },
  {
    label: "毎日の習慣",
    description: "今日の確認と継続カードで、毎日戻る理由が残っています。",
  },
];

export default function DashboardReleaseCheckCard() {
  return (
    <Card className="border border-blue-100 bg-white">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black text-blue-600">公開前の最終確認</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
            Dashboard は Version 1.0 の入口として確認済みです。
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Sprint22 では新機能を増やさず、公開前ユーザーが最初に迷いやすい
            導線と確認ポイントを Dashboard 上で整理しました。
          </p>
        </div>
        <span className="inline-flex shrink-0 rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
          MVP 最終確認
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {releaseCheckItems.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-900">{item.label}</p>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
