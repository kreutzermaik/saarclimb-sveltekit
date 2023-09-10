import { createClient } from '@supabase/supabase-js';
import {dev} from '$app/environment'

let supabaseUrl: string = "";
let supabaseAnonKey: string = "";

if (dev) {
    supabaseUrl = import.meta.env.VITE_DEV_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_DEV_SUPABASE_ANON_KEY;
} else {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
}

/*if (!supabaseUrl || supabaseUrl == '' || supabaseUrl == undefined) {
    supabaseUrl = 'https://tqgufceactcswwkbjfjk.supabase.co';
    supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxZ3VmY2VhY3Rjc3d3a2JqZmprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA2OTMyOTksImV4cCI6MTk4NjI2OTI5OX0.MRYORIJPYAwuRfISOKKsKqCnfABJqLaXT1cZQZ6ZAE4';
}*/

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
