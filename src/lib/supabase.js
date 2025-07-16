
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://uqctsrtrabbqqcmgjion.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxY3RzcnRyYWJicXFjbWdqaW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODM1NzQsImV4cCI6MjA2NTQ1OTU3NH0.bB6NFLR-p4fqXtygR9uhZMujxXBXRb9D_w7b1dYCN8M'
export const supabase = createClient(supabaseUrl, supabaseKey)