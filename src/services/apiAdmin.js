import { supabase } from "../lib/supabase";

// Status update mutation
export async function updateBookingStatus(bookingId, status) {
  try {
    console.log(
      `[ADMIN] Attempting to update booking ${bookingId} with status ${status}`
    );

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId)
      .select();

    console.log("[ADMIN] Update response:", { data, error });

    if (error) {
      console.error("[ADMIN] Error updating booking status:", error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }

    // Check if we got results back
    if (!data || data.length === 0) {
      console.error(
        "[ADMIN] No data returned from update operation. Possible RLS policy issue."
      );

      // Let's check if the booking still exists
      const { data: checkData, error: checkError } = await supabase
        .from("bookings")
        .select("id, status")
        .eq("id", bookingId);

      console.log("[ADMIN] Booking check after failed update:", {
        checkData,
        checkError,
      });

      throw new Error(
        `No booking returned after update for ID ${bookingId}. This may be a permission issue.`
      );
    }

    // Use the first result since we're not using single() anymore
    return data[0];
  } catch (error) {
    console.error("Error in apiAdmin updateBookingStatus:", error);
    throw error;
  }
}

// Get bookings with pagination, sorting, and filtering
export async function getBookingsWithDetails({
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  dateRange = null,
  status = null,
} = {}) {
  console.log("Fetching bookings with params:", {
    page,
    limit,
    sortBy,
    sortOrder,
    dateRange,
    status,
  });
  let query = supabase.from("bookings").select(`
      *,
      service:services!bookings_service_id_fkey(
        id,
        name,
        description,
        price,
        image_url,
        category
      ),
      provider:profile!bookings_provider_id_fkey(
        id,
        full_name,
        avatar_url
      ),
      client:profile(
        id,
        full_name,
        avatar_url
      )
    `);

  // Apply filters
  if (dateRange?.start) {
    query = query.gte("created_at", dateRange.start);
  }
  if (dateRange?.end) {
    query = query.lte("created_at", dateRange.end);
  }
  if (status) {
    query = query.eq("status", status);
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const {
    data: bookings,
    error,
    count,
  } = await query.select("*", { count: "exact" });

  if (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }

  console.log("Returning bookings data:", {
    bookingsCount: bookings.length,
    count,
    page,
    totalPages: Math.ceil(count / limit),
  });

  return {
    bookings: bookings.map((booking) => ({
      ...booking,
      item: {
        ...booking.item,
        image: booking.item?.image_url || null,
      },
    })),
    totalCount: count || bookings.length,
    currentPage: page,
    totalPages: Math.ceil((count || bookings.length) / limit),
  };
}

export async function checkIsAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data: profile, error } = await supabase
    .from("profile")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error) throw new Error("Failed to fetch admin status");
  if (!profile?.is_admin) throw new Error("Not authorized");

  return true;
}

export async function getBookingStats() {
  // Get current date in ISO format
  const today = new Date().toISOString();

  // Get total bookings count
  const {
    count: totalBookings,
    error: totalError,
    data: bookingsData,
  } = await supabase.from("bookings").select("*", { count: "exact" });

  // Debug booking counts
  console.log("Booking stats query results:", {
    totalBookings,
    bookingsCount: bookingsData?.length,
    totalError,
  });

  // Get active bookings (confirmed or active status)
  const {
    count: activeBookings,
    error: activeError,
    data: activeBookingsData,
  } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .in("status", ["confirmed", "active"])
    .gte("end_date", today);

  console.log("Active bookings query:", {
    activeBookings,
    activeBookingsCount: activeBookingsData?.length,
    activeError,
  });

  // Get pending bookings count
  const {
    count: pendingBookings,
    error: pendingError,
    data: pendingBookingsData,
  } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .eq("status", "pending");

  console.log("Pending bookings query:", {
    pendingBookings,
    pendingBookingsCount: pendingBookingsData?.length,
    pendingError,
  });

  // Get total revenue
  const { data: revenueData, error: revenueError } = await supabase
    .from("bookings")
    .select("total_price")
    .in("status", ["confirmed", "active", "completed"]);

  if (totalError || activeError || pendingError || revenueError) {
    console.error("Error fetching stats:", {
      totalError,
      activeError,
      pendingError,
      revenueError,
    });
    throw new Error("Failed to fetch booking statistics");
  }

  const totalRevenue =
    revenueData?.reduce(
      (sum, booking) => sum + (parseFloat(booking.total_price) || 0),
      0
    ) || 0;

  // If count is undefined but we have data, use the length of the data array
  const finalTotalBookings =
    totalBookings !== null ? totalBookings : bookingsData?.length || 0;
  const finalActiveBookings =
    activeBookings !== null ? activeBookings : activeBookingsData?.length || 0;
  const finalPendingBookings =
    pendingBookings !== null
      ? pendingBookings
      : pendingBookingsData?.length || 0;

  return {
    totalBookings: finalTotalBookings,
    activeBookings: finalActiveBookings,
    pendingBookings: finalPendingBookings,
    totalRevenue: totalRevenue,
  };
}

export async function getMonthlyStats() {
  // Get bookings for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("start_date, total_price, status")
    .gte("start_date", sixMonthsAgo.toISOString())
    .in("status", ["confirmed", "active", "completed"]);

  if (error) {
    console.error("Error fetching monthly stats:", error);
    throw new Error("Failed to fetch monthly statistics");
  }

  return processMonthlyData(bookings);
}

function processMonthlyData(bookings) {
  const monthlyData = {};

  bookings.forEach((booking) => {
    const month = new Date(booking.start_date).toLocaleDateString("en-US", {
      month: "short",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, revenue: 0 };
    }
    monthlyData[month].count += 1;
    monthlyData[month].revenue += parseFloat(booking.total_price) || 0;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    count: data.count,
    revenue: data.revenue,
  }));
}

// Get all authenticated users with their profiles
export async function getAllUsers() {
  // First get all profiles with their admin status
  const { data: profiles, error: profileError } = await supabase
    .from("profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (profileError) {
    console.error("Error fetching user profiles:", profileError);
    throw new Error("Failed to fetch user profiles");
  }

  return profiles;
}

// Update user admin status
export async function updateUserAdminStatus(userId, isAdmin) {
  try {
    const { data, error } = await supabase
      .from("profile")
      .update({ is_admin: isAdmin })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating user admin status:", error);
      throw new Error(`Failed to update user admin status: ${error.message}`);
    }

    return data[0];
  } catch (error) {
    console.error("Error in apiAdmin updateUserAdminStatus:", error);
    throw error;
  }
}
