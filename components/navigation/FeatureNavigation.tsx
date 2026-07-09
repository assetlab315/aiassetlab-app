import Link from "next/link";
import { FEATURE_NAV_ITEMS } from "../../features/navigation/constants";

type Props = {
  currentPath: string;
  title?: string;
};

export default function FeatureNavigation({
  currentPath,
  title = "次に使う機能",
}: Props) {
  const items = FEATURE_NAV_ITEMS.filter((item) => item.href !== currentPath);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">Navigation</p>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
        <Link
          href="/mvp"
          className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
        >
          MVP一覧
        </Link>
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
            <p className="mt-3 text-sm font-bold text-blue-600">開く</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
