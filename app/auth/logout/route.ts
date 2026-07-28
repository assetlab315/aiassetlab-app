import { NextResponse } from "next/server";
import { canUseSupabaseServerClient, createSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  if (canUseSupabaseServerClient()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/login?logged_out=1", request.url), {
    status: 303,
  });
}
