import type { Metadata } from "next";
import LoginClient from "../../components/auth/LoginClient";

export const metadata: Metadata = {
  title: "ログイン",
  description: "AI Asset Labへログインし、資産データをクラウドへ安全に保存する準備をします。",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
