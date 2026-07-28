import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|icon.svg|apple-touch-icon.svg|og-image.svg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
