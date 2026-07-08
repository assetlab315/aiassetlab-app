import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Asset Lab App",
  description: "AIで、資産形成をもっとシンプルに。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="font-extrabold text-xl">AI Asset Lab</Link>
            <nav className="hidden md:flex gap-5 text-sm font-medium">
              <Link href="/diagnosis">AI診断</Link>
              <Link href="/simulator">シミュレーター</Link>
              <Link href="/portfolio">ポートフォリオ</Link>
              <Link href="/chat">AI相談</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
