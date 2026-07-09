import Link from "next/link";

const navItems = [
  { label: "ホーム", href: "/dashboard" },
  { label: "資産", href: "/portfolio" },
  { label: "将来のお金", href: "/simulator" },
  { label: "AIに相談", href: "/chat" },
];

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
        <Link href="/dashboard" className="inline-flex flex-col">
          <span className="text-lg font-black tracking-tight text-slate-900">
            AI Asset Lab
          </span>
          <span className="text-xs font-semibold text-blue-600">
            AIと一緒に、毎日一歩ずつ資産形成
          </span>
        </Link>

        <nav className="flex flex-wrap gap-2" aria-label="メインナビゲーション">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
