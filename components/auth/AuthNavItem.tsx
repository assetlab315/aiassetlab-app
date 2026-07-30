"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "../../lib/supabase/client";

export default function AuthNavItem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/dashboard")}`;

  useEffect(() => {
    if (!canUseSupabaseBrowserClient()) return;

    let mounted = true;
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setIsLoggedIn(Boolean(data.user));
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <Link
      href={isLoggedIn ? "/account" : loginHref}
      className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
    >
      {isLoggedIn ? "アカウント" : "ログイン"}
    </Link>
  );
}
