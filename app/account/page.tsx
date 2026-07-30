import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountClient from "../../components/auth/AccountClient";
import { canUseSupabaseServerClient, createSupabaseServerClient } from "../../lib/supabase/server";

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

export default async function AccountPage() {
  if (canUseSupabaseServerClient()) {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      redirect("/login?next=/account");
    }
  }

  return <AccountClient />;
}
