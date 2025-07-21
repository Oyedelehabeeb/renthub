import { supabase } from "../lib/supabase";
import { createNotification } from "./apiNotification";

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
  try {
    // Start a Supabase transaction
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
      .select();

    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }

    // Check if we got results back
    if (!data || data.length === 0) {
      throw new Error(`Failed to create booking`);
    }

    // Use the first result instead of expecting a single result
    const createdBooking = data[0];

    try {
      // Get item details for notification
      const { data: itemData, error: itemError } = await supabase
        .from("items")
        .select("name")
        .eq("id", item_id)
        .single();

      if (itemError) {
        console.error(
          "Error fetching item details for notification:",
          itemError
        );
      }

      // Get renter details for notification
      const { data: renterData, error: renterError } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", renter_id)
        .single();

      if (renterError) {
        console.error(
          "Error fetching renter details for notification:",
          renterError
        );
      }

      console.log("Creating notification with data:", {
        user_id: owner_id,
        booking_id: createdBooking.id,
        type: "booking_request",
        title: "New Booking Request",
        message: `${
          renterData?.full_name || "Someone"
        } has requested to book your "${
          itemData?.name || "item"
        }" from ${new Date(start_date).toLocaleDateString()} to ${new Date(
          end_date
        ).toLocaleDateString()}.`,
      });

      // Create notification for the owner
      const notification = await createNotification({
        user_id: owner_id,
        booking_id: createdBooking.id,
        type: "booking_request",
        title: "New Booking Request",
        message: `${
          renterData?.full_name || "Someone"
        } has requested to book your "${
          itemData?.name || "item"
        }" from ${new Date(start_date).toLocaleDateString()} to ${new Date(
          end_date
        ).toLocaleDateString()}.`,
      });

      console.log("Notification created:", notification);
    } catch (notificationError) {
      console.error(
        "Error creating notification (details):",
        notificationError
      );
      // Don't throw error here - booking was created successfully
    }

    return createdBooking;
  } catch (error) {
    console.error("Error in createBooking:", error);
    throw error;
  }
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
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, item:items(*), renter:profile(*), owner:profile(*)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching booking:", error);
      throw error;
    }

    if (!data) {
      throw new Error(`Booking with ID ${id} not found`);
    }

    return data;
  } catch (error) {
    console.error("Error in getBooking:", error);
    throw error;
  }
}

// Update booking status
export async function updateBookingStatus(bookingId, status) {
  try {
    // First get the booking details to access owner and renter IDs
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("item_id, renter_id, owner_id")
      .eq("id", bookingId)
      .single();

    if (fetchError) {
      console.error("Error fetching booking:", fetchError);
      throw fetchError;
    }

    if (!booking) {
      throw new Error(`Booking with ID ${bookingId} not found`);
    }

    console.log(
      `Attempting to update booking ${bookingId} with status ${status}`
    );

    // Update the booking status
    const { data, error, count } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select();

    console.log("Update response:", { data, error, count });

    if (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }

    // Check if we got results back
    if (!data || data.length === 0) {
      console.error(
        "No data returned from update operation. Possible RLS policy issue."
      );

      // Let's check if the booking still exists
      const { data: checkData, error: checkError } = await supabase
        .from("bookings")
        .select("id, status")
        .eq("id", bookingId);

      console.log("Booking check after failed update:", {
        checkData,
        checkError,
      });

      throw new Error(
        `No booking returned after update for ID ${bookingId}. This may be a permission issue.`
      );
    }

    // Use the first result since we're not using single() anymore
    const updatedBooking = data[0];

    // Process notifications
    try {
      // Get item details for notification
      const { data: itemData } = await supabase
        .from("items")
        .select("name")
        .eq("id", booking.item_id)
        .single();

      // Get owner details for notification
      const { data: ownerData } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", booking.owner_id)
        .single();

      let notificationType = "";
      let title = "";
      let message = "";

      // Create notification based on new status
      switch (status) {
        case "confirmed":
          notificationType = "booking_approved";
          title = "Booking Approved";
          message = `${
            ownerData?.full_name || "Owner"
          } has approved your booking for "${itemData?.name || "item"}".`;

          // Send notification to renter
          await createNotification({
            user_id: booking.renter_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message,
          });
          break;

        case "rejected":
          notificationType = "booking_rejected";
          title = "Booking Rejected";
          message = `${
            ownerData?.full_name || "Owner"
          } has rejected your booking for "${itemData?.name || "item"}".`;

          // Send notification to renter
          await createNotification({
            user_id: booking.renter_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message,
          });
          break;

        case "cancelled":
          // We don't have cancelled_by in the response, so we'll simplify this
          notificationType = "booking_cancelled";
          title = "Booking Cancelled";

          // Send notification to both parties
          // To renter
          await createNotification({
            user_id: booking.renter_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message: `Your booking for "${
              itemData?.name || "item"
            }" has been cancelled.`,
          });

          // To owner
          await createNotification({
            user_id: booking.owner_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message: `A booking for your "${
              itemData?.name || "item"
            }" has been cancelled.`,
          });
          break;

        default:
          // No notification for other status changes
          break;
      }
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't throw error here - booking was updated successfully
    }

    return updatedBooking;
  } catch (error) {
    console.error("Error in updateBookingStatus:", error);
    throw error;
  }
}

// Function to diagnose permission issues
export async function diagnoseBookingPermissions(bookingId) {
  try {
    console.log(`Diagnosing permissions for booking ${bookingId}`);

    // First check if we can read the booking
    const { data: readData, error: readError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId);

    console.log("Read permission check:", {
      success: !readError,
      count: readData?.length,
    });

    if (readError) {
      console.error("Cannot read booking:", readError);
      return {
        success: false,
        error: readError.message,
        canRead: false,
        canWrite: false,
      };
    }

    // Then try a no-op update (update status to same value)
    if (readData && readData.length > 0) {
      const currentStatus = readData[0].status;
      const { data: writeData, error: writeError } = await supabase
        .from("bookings")
        .update({ status: currentStatus })
        .eq("id", bookingId)
        .select();

      console.log("Write permission check:", {
        success: !writeError && writeData?.length > 0,
        currentStatus,
        result: writeData,
      });

      return {
        success: true,
        canRead: true,
        canWrite: !writeError && writeData?.length > 0,
        writeError: writeError?.message,
        booking: readData[0],
      };
    }

    return {
      success: true,
      canRead: true,
      canWrite: false,
      booking: null,
      error: "Booking not found",
    };
  } catch (error) {
    console.error("Error in diagnoseBookingPermissions:", error);
    return {
      success: false,
      error: error.message,
      canRead: false,
      canWrite: false,
    };
  }
}
