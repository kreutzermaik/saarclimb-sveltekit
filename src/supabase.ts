import { createClient } from '@supabase/supabase-js';
import {dev} from '$app/environment'

let supabaseUrl: string = "";
let supabaseAnonKey: string = "";

if (dev) {
    supabaseUrl = import.meta.env.VITE_DEV_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_DEV_SUPABASE_ANON_KEY;
} else {
    supabaseUrl = import.meta.env.VITE_SUPABASE_ANON_KEY;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
