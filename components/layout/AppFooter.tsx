import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 text-sm text-slate-500 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-slate-700">AI Asset Lab</p>
            <p className="mt-1">AIで、資産形成をもっとシンプルに。</p>
          </div>
          <p className="font-semibold text-slate-600">Version1.1</p>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="フッターナビゲーション">
            <Link
              href="/terms"
              className="font-semibold text-slate-600 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="font-semibold text-slate-600 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              プライバシーポリシー
            </Link>
            <a
              href="mailto:contact@aiassetlab.jp"
              className="font-semibold text-slate-600 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              お問い合わせ
            </a>
          </nav>
          <p>Copyright 2026 AI Asset Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
