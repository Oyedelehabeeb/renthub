import { supabase } from "../lib/supabase";


export async function addItem({
  name,
  description,
  image_url,
  price,
  category,
  owner_id,
}) {
  const { data, error } = await supabase
    .from("items")
    .insert([{ name, description, image_url, price, category, owner_id }])
    .select();
  if (error) throw error;
  return data;
}
