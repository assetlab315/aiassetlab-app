import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import AppFooter from "../components/layout/AppFooter";
import { BarChart3, Bot, Gauge, Home, LayoutDashboard } from "lucide-react";

const siteUrl = "https://aiassetlab.jp";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Asset Lab | AIで資産形成の次の一歩を整理",
    template: "%s | AI Asset Lab",
  },
  description:
    "AI Asset Labは、AI診断、資産登録、Dashboard、AI相談で資産形成の現在地と今日やることを整理するサービスです。",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "AI Asset Lab | AIで資産形成の次の一歩を整理",
    description:
      "AI診断、資産登録、Dashboard、AI相談で、今日やることを迷わず決められます。",
    url: siteUrl,
    siteName: "AI Asset Lab",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "AI Asset Lab",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Asset Lab | AIで資産形成の次の一歩を整理",
    description: "AI診断からDashboard、AI相談まで迷わず進めます。",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

const nav = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/diagnosis", label: "診断する", icon: Gauge },
  { href: "/portfolio", label: "資産を見る", icon: BarChart3 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "AIに相談する", icon: Bot },
];

function AnalyticsScripts() {
  return (
    <>
      {gaMeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag("js", new Date());
              gtag("config", "${gaMeasurementId}");
            `}
          </Script>
        </>
      ) : null}

      {clarityId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      ) : null}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AnalyticsScripts />
        <div className="min-h-screen bg-slate-50">
          <aside className="hidden border-r bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <Link
                href="/"
                className="text-xl font-extrabold tracking-tight focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                AI Asset Lab
              </Link>
            </div>
            <nav className="flex-1 space-y-1 px-4 py-6">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
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
                <Link
                  href="/"
                  className="font-extrabold focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 lg:hidden"
                >
                  AI Asset Lab
                </Link>
                <div className="hidden lg:block">
                  <p className="text-sm font-bold text-slate-500">AIで、資産形成をもっとシンプルに。</p>
                </div>
                <a
                  href="https://aiassetlab.jp"
                  className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  Webサイトへ
                </a>
              </div>
              <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </header>
            {children}
            <AppFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
