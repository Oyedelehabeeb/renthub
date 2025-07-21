/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "./useNotification";
import { formatDistanceToNow } from "date-fns";
import { Check, Bell, Clock, X, CheckCheck } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({ onClose }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useNotifications({ page, limit: 5 });
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();
  const navigate = useNavigate();

  const handleClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to the booking
    if (notification.booking_id) {
      navigate(`/bookings/${notification.booking_id}`);
      onClose();
    } else {
      // If there's no booking_id, just mark as read but don't navigate
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_request":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "booking_approved":
        return <Check className="w-5 h-5 text-green-400" />;
      case "booking_rejected":
        return <X className="w-5 h-5 text-red-400" />;
      case "booking_cancelled":
        return <X className="w-5 h-5 text-orange-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-md shadow-lg z-50 border border-gray-700 overflow-hidden">
      <div className="p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Notifications</h3>
          {data?.notifications?.some((n) => !n.is_read) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-3 h-3" />
              Mark all as read
            </Button>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-400">
            Loading notifications...
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-red-400">
            Failed to load notifications
          </div>
        ) : data?.notifications?.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            No notifications yet
          </div>
        ) : (
          data?.notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 cursor-pointer hover:bg-gray-800 transition-colors ${
                !notification.is_read ? "bg-gray-800/40" : ""
              }`}
              onClick={() => handleClick(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {notification.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {data?.totalPages > 1 && (
        <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-600"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-gray-400">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gray-600"
            disabled={page === data.totalPages}
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}

      <Separator className="bg-gray-700" />

      <div className="p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm border-gray-600"
          onClick={() => {
            navigate("/notifications");
            onClose();
          }}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
}
