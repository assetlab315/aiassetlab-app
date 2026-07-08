import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Bot, Calculator, Gauge, LayoutDashboard } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Asset Lab App",
  description: "AIで、資産形成をもっとシンプルに。",
};

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/diagnosis", label: "AI診断", icon: Gauge },
  { href: "/simulator", label: "シミュレーター", icon: Calculator },
  { href: "/portfolio", label: "ポートフォリオ", icon: BarChart3 },
  { href: "/chat", label: "AI相談", icon: Bot },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-slate-50">
          <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r bg-white">
            <div className="flex h-16 items-center px-6 border-b">
              <Link href="/" className="text-xl font-extrabold tracking-tight">
                AI Asset Lab
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-6">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700">
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4">
              <div className="rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-sm font-bold">β版公開中</p>
                <p className="mt-1 text-xs text-slate-300">診断・シミュレーション・AI相談を順次改善中です。</p>
              </div>
            </div>
          </aside>

          <div className="lg:pl-72">
            <header className="sticky top-0 z-10 border-b bg-white/85 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link href="/" className="font-extrabold lg:hidden">AI Asset Lab</Link>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-500">AIで、資産形成をもっとシンプルに。</p>
                </div>
                <a href="https://aiassetlab.jp" className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-slate-50">
                  Webサイトへ
                </a>
              </div>
              <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
