import Link from "next/link";
import { FEATURE_NAV_ITEMS } from "../../features/navigation/constants";

type Props = {
  currentPath: string;
  title?: string;
};

export default function FeatureNavigation({
  currentPath,
  title = "次に進む場所",
}: Props) {
  const items = FEATURE_NAV_ITEMS.filter((item) => item.href !== currentPath);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-blue-600">迷ったらここから</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          ホームで確認し、資産を更新し、必要なときだけAIに相談します。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <p className="font-bold text-slate-900">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
            <p className="mt-3 text-sm font-bold text-blue-600">開く →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
