import Link from "next/link";

const navItems = [
  { label: "ホーム", href: "/dashboard" },
  { label: "診断", href: "/diagnosis" },
  { label: "資産登録", href: "/portfolio" },
  { label: "AI相談", href: "/chat" },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <Link href="/" className="inline-flex flex-col">
          <span className="text-lg font-black tracking-tight text-slate-900">
            AI Asset Lab
          </span>
          <span className="text-xs font-semibold text-blue-600">
            AIが毎日の資産形成を整理します
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2" aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
