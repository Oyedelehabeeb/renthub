import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookingsByRenter,
  getBookingsByItem,
  getBooking,
  updateBookingStatus,
} from "../../services/apiBooking";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      // Invalidate queries that might be affected by this booking
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
      return data; // Return data for further use in the component
    },
  });
}

export function useBookingsByRenter(renterId) {
  return useQuery({
    queryKey: ["bookings", "renter", renterId],
    queryFn: () => getBookingsByRenter(renterId),
    enabled: !!renterId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 60000, // 1 minute
  });
}

export function useBookingsByItem(itemId) {
  return useQuery({
    queryKey: ["bookings", "item", itemId],
    queryFn: () => getBookingsByItem(itemId),
    enabled: !!itemId,
  });
}

export function useBooking(id) {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, status }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      // Invalidate queries that might be affected by this status update
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}
