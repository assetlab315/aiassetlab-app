import Link from "next/link";
import Card from "../ui/Card";

const featureItems = [
  {
    label: "ホーム",
    description: "今日の判断と次の一歩を確認する",
    actionLabel: "ホームを見る",
    href: "/dashboard",
  },
  {
    label: "資産登録",
    description: "保有資産と毎月積立を更新する",
    actionLabel: "資産を見る",
    href: "/portfolio",
  },
  {
    label: "AI相談",
    description: "迷ったことを短くAIに聞く",
    actionLabel: "AIに相談する",
    href: "/chat",
  },
  {
    label: "AI診断",
    description: "まだ迷うときは最初の状態を診断する",
    actionLabel: "診断する",
    href: "/diagnosis",
  },
];

type Props = {
  currentPath: string;
  title?: string;
};

export default function FeatureNavigation({
  currentPath,
  title = "次に進む場所",
}: Props) {
  const items = featureItems.filter((item) => item.href !== currentPath);

  return (
    <Card>
      <div className="mb-4">
        <p className="text-sm font-semibold text-blue-600">迷ったらここから</p>
        <h2 className="mt-1 text-xl font-black text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          AI Asset Labでは、ホームで確認し、資産を更新し、必要なときだけAIに相談します。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <p className="font-black text-slate-900">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
            <p className="mt-3 text-sm font-black text-blue-600">
              {item.actionLabel} →
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
