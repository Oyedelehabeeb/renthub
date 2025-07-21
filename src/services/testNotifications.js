import { supabase } from "../lib/supabase";
import { createNotification } from "./apiNotification";

// Function to check notifications table structure
export async function checkNotificationsTable() {
  try {
    // Try to get table information
    const { error: queryError } = await supabase
      .from("notifications")
      .select("*")
      .limit(1);

    if (queryError) {
      console.error("Error accessing notifications table:", queryError);
      return { success: false, error: queryError };
    }

    // Try to insert a test notification directly with supabase
    const testId = "00000000-0000-0000-0000-000000000000"; // Non-existent UUID
    const { data: insertData, error: insertError } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: testId,
          type: "test",
          title: "Test Notification",
          message: "This is a test notification",
          // Note: Omitting booking_id to see if it's optional
        },
      ])
      .select();

    if (insertError) {
      console.error("Error inserting test notification:", insertError);
      return { success: false, error: insertError };
    }

    // Try using the createNotification function
    try {
      const notificationResult = await createNotification({
        user_id: testId,
        type: "test_api",
        title: "Test API Notification",
        message: "This is a test notification from API",
      });

      console.log("API notification created:", notificationResult);
    } catch (apiError) {
      console.error("Error using createNotification API:", apiError);
      return { success: false, error: apiError };
    }

    // Clean up (don't leave test data)
    if (insertData && insertData.length > 0) {
      await supabase.from("notifications").delete().eq("id", insertData[0].id);
    }

    return {
      success: true,
      tableExists: true,
      insertWorks: true,
    };
  } catch (error) {
    console.error("Unexpected error during table check:", error);
    return { success: false, error };
  }
}

// Export a function to test booking notification creation
export async function testBookingNotification() {
  try {
    // Get a real user ID from the database
    const { data: users, error: userError } = await supabase
      .from("profile")
      .select("id")
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error("Error getting user:", userError);
      return { success: false, error: userError || "No users found" };
    }

    const userId = users[0].id;

    // Create a test notification for this user
    const notification = await createNotification({
      user_id: userId,
      type: "test_booking",
      title: "Test Booking Notification",
      message: "This is a test booking notification",
    });

    return {
      success: true,
      notification,
      userId,
    };
  } catch (error) {
    console.error("Error testing booking notification:", error);
    return { success: false, error };
  }
}
