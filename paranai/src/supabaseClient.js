import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xlsdgdosrkohgncjodud.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-ra2xRGsIt1J2_bajElJAA_3BJrt1Zj';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
