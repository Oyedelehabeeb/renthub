import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBooking,
  getBookingsByClient,
  getBookingsByService,
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

export function useBookingsByRenter(clientId) {
  return useQuery({
    queryKey: ["bookings", "client", clientId],
    queryFn: () => getBookingsByClient(clientId),
    enabled: !!clientId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 60000, // 1 minute
  });
}

export function useBookingsByItem(serviceId) {
  return useQuery({
    queryKey: ["bookings", "service", serviceId],
    queryFn: () => getBookingsByService(serviceId),
    enabled: !!serviceId,
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
