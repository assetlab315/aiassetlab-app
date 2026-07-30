"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "../../lib/supabase/client";
import { getSafeAuthRedirectPath } from "../../lib/auth/redirect";

function getCallbackUrl(nextPath: string) {
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
}

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextPath, setNextPath] = useState("/dashboard");
  const canUseSupabase = useMemo(() => canUseSupabaseBrowserClient(), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeAuthRedirectPath(params.get("next")));
  }, []);

  const handleGoogleLogin = async () => {
    if (!canUseSupabase) {
      setMessage("Supabase環境変数が未設定のため、ログインを開始できません。");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getCallbackUrl(nextPath),
      },
    });

    if (error) {
      setMessage("Googleログインを開始できませんでした。時間をおいて再度お試しください。");
      setIsSubmitting(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) return;
    if (!canUseSupabase) {
      setMessage("Supabase環境変数が未設定のため、メール認証を開始できません。");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: getCallbackUrl(nextPath),
      },
    });

    setIsSubmitting(false);
    setMessage(
      error
        ? "メールを送信できませんでした。設定を確認して再度お試しください。"
        : "ログイン用メールを送信しました。メール内のリンクから続けてください。",
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 md:px-8">
      <div className="mx-auto max-w-xl">
        <Card className="border border-slate-100 bg-white">
          <p className="text-sm font-black text-blue-600">AI Asset Lab</p>
          <h1 className="mt-3 text-3xl font-black">AI Asset Labにログイン</h1>
          <p className="mt-4 leading-7 text-slate-600">
            資産データを安全に保存し、別の端末でも確認できます。
          </p>
          <p className="mt-3 rounded-2xl bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-800">
            ログイン前にこのブラウザへ登録した資産は、初回ログイン時にクラウドへ移行できます。
          </p>

          {!canUseSupabase ? (
            <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
              Supabase環境変数が未設定です。ゲスト利用は継続できますが、ログイン機能は設定後に利用できます。
            </p>
          ) : null}

          <div className="mt-6 space-y-3">
            <Button onClick={handleGoogleLogin} className="w-full" type="button">
              Googleで続ける
            </Button>
            <div className="rounded-2xl border border-slate-100 p-4">
              <label className="text-sm font-black text-slate-700" htmlFor="login-email">
                メールアドレスで続ける
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="you@example.com"
              />
              <Button
                onClick={handleEmailLogin}
                variant="outline"
                className="mt-3 w-full"
                type="button"
              >
                メールを送る
              </Button>
            </div>
          </div>

          {message ? (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
              {message}
            </p>
          ) : null}
          {isSubmitting ? (
            <p className="mt-4 text-sm font-bold text-slate-500">ログインを準備しています…</p>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
