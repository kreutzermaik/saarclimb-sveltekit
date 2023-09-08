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

if (!supabaseUrl || supabaseUrl == '' || supabaseUrl == undefined) {
    supabaseUrl = 'https://ybeongwjjfdkgizzkmsc.supabase.co';
    supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZW9uZ3dqamZka2dpenprbXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI4MjMzMzQsImV4cCI6MTk4ODM5OTMzNH0.NaSZptwqEuuAfhKmoCV_lHraA8nROlQmwKCxEHc8z34';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
