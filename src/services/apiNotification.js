import { supabase } from "../lib/supabase";

// Create a new notification
export async function createNotification({
  user_id,
  booking_id,
  type,
  title,
  message,
}) {
  const notificationData = {
    user_id,
    type,
    title,
    message,
    is_read: false,
  };

  // Only add booking_id if it exists
  if (booking_id) {
    notificationData.booking_id = booking_id;
  }

  console.log("Creating notification with data:", notificationData);

  const { data, error } = await supabase
    .from("notifications")
    .insert([notificationData])
    .select()
    .single();

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
  return data;
}

// Get all notifications for a user with pagination
export async function getNotifications(
  userId,
  { page = 1, limit = 10, onlyUnread = false } = {}
) {
  let query = supabase
    .from("notifications")
    .select("*, booking:bookings!notifications_booking_id_fkey(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (onlyUnread) {
    query = query.eq("is_read", false);
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .range(from, to)
    .select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }

  return {
    notifications: data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
  return data;
}

// Mark all notifications for a user as read
export async function markAllNotificationsAsRead(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false)
    .select();

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
  return data;
}

// Delete a notification
export async function deleteNotification(notificationId) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
  return true;
}

// Get unread notification count
export async function getUnreadNotificationCount(userId) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error getting unread notification count:", error);
    throw error;
  }

  return count;
}

// Subscribe to real-time notifications for a user
export function subscribeToUserNotifications(userId, callback) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
}
