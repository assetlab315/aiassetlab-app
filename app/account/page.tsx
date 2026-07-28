import type { Metadata } from "next";
import AccountClient from "../../components/auth/AccountClient";

export const metadata: Metadata = {
  title: "アカウント",
  description: "AI Asset Labのログイン状態とPortfolio同期状態を確認できます。",
  alternates: {
    canonical: "/account",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return <AccountClient />;
}
