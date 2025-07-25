import { supabase } from "../lib/supabase";
import { createNotification } from "./apiNotification";

// Calculate additional fees for services that exceeded their scheduled period
// Rate is 150% of daily price for each day beyond the schedule
export async function calculateLateFees(bookingId) {
  try {
    // Get booking details with service info
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("*, services:service_id(*)")
      .eq("id", bookingId)
      .single();

    if (error) throw error;

    const endDate = new Date(booking.end_date);
    const actualCompletionDate = new Date(
      booking.actual_completion_date || new Date()
    );

    // If completed on time, no additional fee
    if (actualCompletionDate <= endDate) {
      return { lateFee: 0, daysLate: 0 };
    }

    // Calculate days past schedule (rounded up)
    const daysLate = Math.ceil(
      (actualCompletionDate - endDate) / (1000 * 60 * 60 * 24)
    );

    // Calculate additional fee (150% of daily rate per day)
    const dailyRate = booking.services.price;
    const additionalFeeRate = 1.5; // 150%
    const lateFee = Math.round(daysLate * dailyRate * additionalFeeRate);

    // Update booking with late fee info
    await supabase
      .from("bookings")
      .update({
        late_fee: lateFee,
        days_late: daysLate,
      })
      .eq("id", bookingId);

    return { lateFee, daysLate };
  } catch (error) {
    console.error("Error calculating late fees:", error);
    return { lateFee: 0, daysLate: 0 };
  }
}

// Create a new booking
export async function createBooking({
  service_id,
  client_id,
  provider_id,
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
          service_id,
          client_id,
          provider_id,
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
      // Get service details for notification
      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("name")
        .eq("id", service_id)
        .single();

      if (serviceError) {
        console.error(
          "Error fetching service details for notification:",
          serviceError
        );
      }

      // Get client details for notification
      const { data: clientData, error: clientError } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", client_id)
        .single();

      if (clientError) {
        console.error(
          "Error fetching client details for notification:",
          clientError
        );
      }

      console.log("Creating notification with data:", {
        user_id: provider_id,
        booking_id: createdBooking.id,
        type: "booking_request",
        title: "New Booking Request",
        message: `${
          clientData?.full_name || "Someone"
        } has requested to book your "${
          serviceData?.name || "service"
        }" from ${new Date(start_date).toLocaleDateString()} to ${new Date(
          end_date
        ).toLocaleDateString()}.`,
      });

      // Create notification for the provider
      const notification = await createNotification({
        user_id: provider_id,
        booking_id: createdBooking.id,
        type: "booking_request",
        title: "New Booking Request",
        message: `${
          clientData?.full_name || "Someone"
        } has requested to book your "${
          serviceData?.name || "service"
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

// Get bookings for a user (client)
export async function getBookingsByClient(clientId) {
  try {
    // First attempt with 'services' join
    const { data, error } = await supabase
      .from("bookings")
      .select("*, services(*), provider:profile(*)")
      .eq("client_id", clientId);

    if (error) throw error;

    // Log for debugging
    console.log(`Found ${data?.length || 0} bookings for client ${clientId}`);

    return data;
  } catch (error) {
    console.error("Error fetching client bookings:", error);
    throw error;
  }
}

// Get bookings for a service
export async function getBookingsByService(serviceId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, client:(*), provider:profile(*)")
    .eq("service_id", serviceId);
  if (error) throw error;
  return data;
}

// Get a single booking
export async function getBooking(id) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, service:services(*), client:profile(*), provider:profile(*)")
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
    // First get the booking details to access provider and client IDs
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("service_id, client_id, provider_id, end_date")
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

    // If status is 'completed', record the actual completion date
    const updateData = { status };
    if (status === "completed") {
      updateData.actual_completion_date = new Date().toISOString();

      // Check if the service completion is late
      const endDate = new Date(booking.end_date);
      const currentDate = new Date();
      if (currentDate > endDate) {
        // Service completed after schedule - we'll calculate the additional fees after the update
        console.log(
          "Service completed after schedule. Will calculate additional fees."
        );
      }
    }

    // Update the booking status
    const { data, error, count } = await supabase
      .from("bookings")
      .update(updateData)
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
      // Get service details for notification
      const { data: serviceData } = await supabase
        .from("services")
        .select("name")
        .eq("id", booking.service_id)
        .single();

      // Get provider details for notification
      const { data: providerData } = await supabase
        .from("profile")
        .select("full_name")
        .eq("id", booking.provider_id)
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
            providerData?.full_name || "Provider"
          } has approved your booking for "${serviceData?.name || "service"}".`;

          // Send notification to client
          await createNotification({
            user_id: booking.client_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message,
          });
          break;

        case "completed": {
          // Calculate late fees if any
          const { lateFee, daysLate } = await calculateLateFees(bookingId);

          notificationType = "service_completed";
          title = "Service Completed";

          // Get service details for notification
          const { data: serviceData } = await supabase
            .from("services")
            .select("name")
            .eq("id", booking.service_id)
            .single();

          // Notification to provider about completion
          await createNotification({
            user_id: booking.provider_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message: `The "${
              serviceData?.name || "service"
            }" has been completed.`,
          });

          // If there's an additional fee, notify the client
          if (lateFee > 0) {
            await createNotification({
              user_id: booking.client_id,
              booking_id: bookingId,
              type: "additional_fee",
              title: "Additional Service Fee",
              message: `You've been charged an additional fee of ₦${lateFee} because "${
                serviceData?.name || "service"
              }" exceeded the scheduled period by ${daysLate} day${
                daysLate !== 1 ? "s" : ""
              }.`,
            });
          } else {
            // Thank the client for completing the service
            await createNotification({
              user_id: booking.client_id,
              booking_id: bookingId,
              type: "service_completed",
              title: "Service Completed",
              message: `Thank you for using "${
                serviceData?.name || "service"
              }". We hope you were satisfied with our service.`,
            });
          }
          break;
        }

        case "rejected":
          notificationType = "booking_rejected";
          title = "Booking Rejected";
          message = `${
            providerData?.full_name || "Service Provider"
          } has rejected your booking for "${serviceData?.name || "service"}".`;

          // Send notification to client
          await createNotification({
            user_id: booking.client_id,
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
          // To client
          await createNotification({
            user_id: booking.client_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message: `Your booking for "${
              serviceData?.name || "service"
            }" has been cancelled.`,
          });

          // To provider
          await createNotification({
            user_id: booking.provider_id,
            booking_id: bookingId,
            type: notificationType,
            title,
            message: `A booking for your "${
              serviceData?.name || "service"
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
