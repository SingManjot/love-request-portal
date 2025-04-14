
import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = "https://jxngnjmltwrgzkpxzlka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bmdua21sdHdyZ3prcHh6bGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE4MjMyMDAsImV4cCI6MTk5NzM5OTIwMH0.HvOAnQpemyZ7VSavCCDobZGSJVrIkkSsHYDAPWWwnjE";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
