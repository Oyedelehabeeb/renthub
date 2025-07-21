import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
  subscribeToUserNotifications,
} from "../../services/apiNotification";
import { useEffect } from "react";
import { useUser } from "../authentication/useUser";

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}

export function useNotifications(options = {}) {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: ["notifications", userId, options],
    queryFn: () => getNotifications(userId, options),
    enabled: !!userId,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
    enabled: !!user?.id,
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
    },
  });
}

export function useUnreadNotificationCount() {
  const { user } = useUser();
  const userId = user?.id;

  return useQuery({
    queryKey: ["unreadNotificationCount", userId],
    queryFn: () => getUnreadNotificationCount(userId),
    enabled: !!userId,
  });
}

// Custom hook for real-time notifications
export function useNotificationsSubscription() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const subscription = subscribeToUserNotifications(user.id, (payload) => {
      // When a new notification is created
      if (payload.eventType === "INSERT") {
        // Play a sound
        const audio = new Audio("/notification-sound.mp3");
        audio
          .play()
          .catch((err) =>
            console.error("Failed to play notification sound:", err)
          );

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          const { title, message } = payload.new;
          new Notification(title, { body: message });
        }

        // Update queries
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({
          queryKey: ["unreadNotificationCount"],
        });
      } else if (
        payload.eventType === "UPDATE" ||
        payload.eventType === "DELETE"
      ) {
        // Update queries for other changes
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({
          queryKey: ["unreadNotificationCount"],
        });
      }
    });

    // Request notification permission if not already granted
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient]);
}
