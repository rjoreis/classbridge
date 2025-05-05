// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghhuiockncyggmpxckxb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaHVpb2NrbmN5Z2dtcHhja3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjYwNDUsImV4cCI6MjA2MjA0MjA0NX0._Vrfv83erzgmvwtYdzBblUXssNJVhloQVI9eDppv15Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
