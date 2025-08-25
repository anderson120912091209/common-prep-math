import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaitlistUser { 
    id: string;
    email: string; 
    name? : string; 
    provider? : string; 
    avatar_url? : string; 
    user_id? : string;
    math_interests? : string[];
    current_level? : string;
    study_time? : string;
    learning_goals? : string;
    onboarding_completed? : boolean;
    created_at: string; 
    updated_at: string; }

export interface AuthUser { 
    id: string; 
    email: string; 
    user_metadata: {
        name? : string;
        avatar_url? :string;
        provider? : string;
    }
}

