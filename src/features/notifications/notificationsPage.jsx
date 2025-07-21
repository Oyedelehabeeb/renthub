import { useState } from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useDeleteNotification,
} from "./useNotification";
import { formatDistanceToNow } from "date-fns";
import { Bell, Clock, Check, X, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../components/ui/card";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all"); // "all", "unread"
  const limit = 10;

  const { data, isLoading, isError } = useNotifications({
    page,
    limit,
    onlyUnread: filter === "unread",
  });

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const navigate = useNavigate();

  const handleClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to the booking
    if (notification.booking_id) {
      navigate(`/bookings/${notification.booking_id}`);
    }
  };

  const handleDelete = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
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
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Notifications
            </CardTitle>
            <div className="flex gap-3">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-blue-600" : "border-gray-600"}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={
                  filter === "unread" ? "bg-blue-600" : "border-gray-600"
                }
              >
                Unread
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading notifications...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-400">Failed to load notifications</p>
            </div>
          ) : data?.notifications?.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.notifications?.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleClick(notification)}
                  className={`p-4 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-colors ${
                    !notification.is_read ? "bg-gray-800/40" : "bg-gray-800/10"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-white">
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true }
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-500 hover:text-red-400 hover:bg-transparent"
                            onClick={(e) => handleDelete(e, notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {data?.totalPages > 1 && (
                <>
                  <Separator className="my-4 bg-gray-700" />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, data.totalCount)} of{" "}
                      {data.totalCount} notifications
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, data.totalPages) },
                          (_, i) => {
                            // Show pages around current page
                            let pageNum;
                            if (data.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (page <= 3) {
                              pageNum = i + 1;
                            } else if (page >= data.totalPages - 2) {
                              pageNum = data.totalPages - 4 + i;
                            } else {
                              pageNum = page - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  page === pageNum ? "default" : "outline"
                                }
                                size="sm"
                                className={
                                  page === pageNum
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                                }
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600"
                        disabled={page === data.totalPages}
                        onClick={() =>
                          setPage((p) => Math.min(data.totalPages, p + 1))
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
