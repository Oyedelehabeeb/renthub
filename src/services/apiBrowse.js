import { supabase } from "../lib/supabase";

export async function getItems() {
    const {data, error} = await supabase.from("items").select("*")
    if (error) throw new Error(error.message);
    return data;
}