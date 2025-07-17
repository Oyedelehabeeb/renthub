import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBooking,
  getBookingsByRenter,
  getBookingsByItem,
  getBooking,
} from "../../services/apiBooking";

export function useCreateBooking() {
  return useMutation({
    mutationFn: createBooking,
  });
}

export function useBookingsByRenter(renterId) {
  return useQuery({
    queryKey: ["bookings", "renter", renterId],
    queryFn: () => getBookingsByRenter(renterId),
    enabled: !!renterId,
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
