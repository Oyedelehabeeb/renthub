import { supabase } from "../lib/supabase";


// Create a new booking
export async function createBooking({
  item_id,
  renter_id,
  owner_id,
  start_date,
  end_date,
  total_price,
  status = "pending",
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        item_id,
        renter_id,
        owner_id,
        start_date,
        end_date,
        total_price,
        status,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Get bookings for a user (renter)
export async function getBookingsByRenter(renterId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, item:items(*), owner:profiles(*)")
    .eq("renter_id", renterId);
  if (error) throw error;
  return data;
}

// Get bookings for an item
export async function getBookingsByItem(itemId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, renter:profiles(*), owner:profiles(*)")
    .eq("item_id", itemId);
  if (error) throw error;
  return data;
}

// Get a single booking
export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, item:items(*), renter:profiles(*), owner:profiles(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
