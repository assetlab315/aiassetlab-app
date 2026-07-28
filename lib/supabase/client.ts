import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig, hasSupabaseConfig } from "./config";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();
  return createBrowserClient(config.url, config.anonKey);
}

export function canUseSupabaseBrowserClient() {
  return hasSupabaseConfig();
}
