import Link from "next/link";
import Card from "../ui/Card";

const featureItems = [
  {
    label: "Dashboard",
    description: "今日やることを確認する",
    href: "/dashboard",
  },
  {
    label: "Portfolio",
    description: "資産の現在地を見る",
    href: "/portfolio",
  },
  {
    label: "Simulator",
    description: "将来の資産額を試算する",
    href: "/simulator",
  },
  {
    label: "AI Chat",
    description: "次の行動をAIに相談する",
    href: "/chat",
  },
];

type Props = {
  currentPath: string;
  title?: string;
};

export default function FeatureNavigation({
  currentPath,
  title = "次に使う機能",
}: Props) {
  const items = featureItems.filter((item) => item.href !== currentPath);

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Next Action</p>
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
        </div>
        <Link
          href="/mvp"
          className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
        >
          MVP一覧を見る
        </Link>
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
            <p className="mt-3 text-sm font-black text-blue-600">開く →</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
