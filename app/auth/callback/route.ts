import { NextResponse } from "next/server";
import { canUseSupabaseServerClient, createSupabaseServerClient } from "../../../lib/supabase/server";
import { getSafeAuthRedirectPath } from "../../../lib/auth/redirect";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeAuthRedirectPath(requestUrl.searchParams.get("next"));

  if (!canUseSupabaseServerClient()) {
    return NextResponse.redirect(new URL("/login?error=supabase_not_configured", requestUrl));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_failed", requestUrl));
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_callback_failed", requestUrl));
  }

  return NextResponse.redirect(new URL(next, requestUrl));
}
