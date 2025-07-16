import { supabase } from "../lib/supabase";


export async function createProfile({ id, full_name, avatar_url }) {
  const { data, error } = await supabase
    .from("profile")
    .insert([{ id, full_name, avatar_url }])
    .select();
  if (error) throw error;
  return data;
}
