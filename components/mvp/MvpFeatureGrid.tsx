import Link from "next/link";
import { MVP_FEATURES } from "../../features/mvp/constants";

export default function MvpFeatureGrid() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">主要機能</h2>
          <p className="mt-2 text-sm text-slate-500">
            MVPで提供する画面を順番に確認できます。
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MVP_FEATURES.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group rounded-3xl border border-slate-100 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  {feature.step}
                </p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                開く
              </span>
            </div>

            <p className="mt-4 min-h-14 text-sm leading-7 text-slate-600">
              {feature.description}
            </p>

            <p className="mt-4 text-sm font-semibold text-blue-600">
              {feature.action}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
