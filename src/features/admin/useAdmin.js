import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookingsWithDetails,
  getBookingStats,
  getMonthlyStats,
  checkIsAdmin,
  updateBookingStatus,
} from "../../services/apiAdmin";

export function useAdminCheck() {
  return useQuery({
    queryKey: ["admin-check"],
    queryFn: checkIsAdmin,
    staleTime: Infinity,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      // Invalidate and refetch bookings and stats
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookingStats"] });
      queryClient.invalidateQueries({ queryKey: ["monthlyStats"] });
    },
  });
}

export function useBookings({
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  dateRange = null,
  status = null,
} = {}) {
  return useQuery({
    queryKey: [
      "admin-bookings",
      { page, limit, sortBy, sortOrder, dateRange, status },
    ],
    queryFn: () =>
      getBookingsWithDetails({
        page,
        limit,
        sortBy,
        sortOrder,
        dateRange,
        status,
      }),
    keepPreviousData: true,
  });
}

export function useBookingStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getBookingStats,
  });
}

export function useMonthlyStats() {
  return useQuery({
    queryKey: ["admin-monthly-stats"],
    queryFn: getMonthlyStats,
  });
}
