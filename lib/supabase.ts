import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./supabase/config";

const config = getSupabaseConfig();

export const supabase = createClient(config.url, config.anonKey);
