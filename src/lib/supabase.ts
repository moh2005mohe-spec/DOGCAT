import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tdxrkqafoguhrdliyxcn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkeHJrcWFmb2d1aHJkbGl5eGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODY3ODAsImV4cCI6MjEwNDE2Mjc4MH0.gZnlSfZFSyplqIbd9skyxjeEqC0GD7aC2hH9orsxxDE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
