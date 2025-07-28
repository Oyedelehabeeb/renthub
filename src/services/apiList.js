import { supabase } from "../lib/supabase";

export async function addService({
  name,
  description,
  image_url,
  price,
  category,
  provider_id,
}) {
  const { data, error } = await supabase
    .from("services")
    .insert([{ name, description, image_url, price, category, provider_id }])
    .select();
  if (error) throw error;
  return data;
}
