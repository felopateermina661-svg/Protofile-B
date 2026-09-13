import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yunsewsizpyaupplbcdo.supabase.co";
const supabaseAnonKey = "sb_publishable_TL-hXJRq9iaM1-zxjfrqKQ_pakpyGkh";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
