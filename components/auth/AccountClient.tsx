"use client";

import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "../../lib/supabase/client";
import { getPortfolioSyncMeta, clearCloudPortfolioCache } from "../../lib/portfolio/cloudPortfolioCache";
import { clearPortfolioAssets } from "../../lib/portfolio/storage";
import { clearPortfolioSnapshots } from "../../lib/portfolio-history/portfolioSnapshotStorage";

type AccountUser = {
  id: string;
  email: string | null;
};

export default function AccountClient() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      if (!canUseSupabaseBrowserClient()) {
        setIsReady(true);
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      setUser(
        data.user
          ? {
              id: data.user.id,
              email: data.user.email ?? null,
            }
          : null,
      );
      setLastSyncedAt(getPortfolioSyncMeta()?.syncedAt ?? null);
      setIsReady(true);
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (user) {
      clearCloudPortfolioCache(user.id);
    }
    clearPortfolioAssets();
    clearPortfolioSnapshots();

    const form = document.createElement("form");
    form.method = "post";
    form.action = "/auth/logout";
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-2xl">
        <Card className="border border-slate-100 bg-white">
          <p className="text-sm font-black text-blue-600">Account</p>
          <h1 className="mt-3 text-3xl font-black">アカウント</h1>

          {!isReady ? (
            <p className="mt-5 text-sm font-bold text-slate-500">ログイン状態を確認しています…</p>
          ) : null}

          {isReady && !user ? (
            <div className="mt-5 space-y-4">
              <p className="leading-7 text-slate-600">
                現在はログインしていません。ゲスト利用の資産はこのブラウザに保存されます。
              </p>
              <Button href="/login">ログインする</Button>
            </div>
          ) : null}

          {user ? (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black text-slate-500">メールアドレス</p>
                <p className="mt-2 font-black text-slate-900">{user.email ?? "未取得"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black text-slate-500">Portfolio同期</p>
                <p className="mt-2 font-bold leading-6 text-slate-700">
                  ログイン中はSupabaseを保存先として扱い、保存成功後にこの端末へキャッシュします。
                </p>
                <p className="mt-2 text-sm font-bold text-slate-500">
                  最終同期: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString("ja-JP") : "未同期"}
                </p>
              </div>
              <Button onClick={handleLogout} variant="outline" type="button">
                ログアウト
              </Button>
            </div>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
