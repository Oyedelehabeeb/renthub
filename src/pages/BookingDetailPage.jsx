import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBooking, diagnoseBookingPermissions } from "../services/apiBooking";
import { useUser } from "../features/authentication/useUser";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { useUpdateBookingStatus } from "../features/booking/useBooking";
import toast from "react-hot-toast";

// Status colors for badges
const statusColors = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

// Helper function for getting status colors
const getStatusColor = (status) => {
  return (
    statusColors[status?.toLowerCase()] ||
    "bg-gray-500/20 text-gray-400 border-gray-500/30"
  );
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useUser();
  const { mutate: updateBookingStatus } = useUpdateBookingStatus();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setIsLoading(true);
        const data = await getBooking(id);
        setBooking(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details");
        setIsLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  const handleStatusUpdate = (status) => {
    if (!booking) return;

    console.log("Updating booking status:", {
      bookingId: booking.id,
      status,
      currentUser: user?.id,
      isAdmin,
      isOwner: booking.owner_id === user?.id,
      isRenter: booking.renter_id === user?.id,
    });

    updateBookingStatus(
      {
        bookingId: booking.id,
        status: status,
      },
      {
        onSuccess: (result) => {
          console.log("Status update successful:", result);
          const statusMap = {
            cancelled: "Booking cancelled successfully",
            confirmed: "Booking accepted successfully",
            rejected: "Booking rejected successfully",
          };
          toast.success(statusMap[status] || `Status updated to ${status}`);
          setBooking((prev) => ({ ...prev, status: status }));
        },
        onError: (err) => {
          console.error("Error updating booking:", err);
          toast.error(
            `Error updating booking: ${err.message || "Please try again."}`
          );

          // If this appears to be an RLS issue, show a more helpful message
          if (
            err.message?.includes("permission") ||
            err.message?.includes("policy")
          ) {
            toast.error(
              "You don't have permission to update this booking. This might be an authorization issue."
            );
          }
        },
      }
    );
  };

  const handleCancel = () => handleStatusUpdate("cancelled");
  const handleAccept = () => handleStatusUpdate("confirmed");
  const handleReject = () => handleStatusUpdate("rejected");

  // Check if user has permission to view this booking
  const canViewBooking = () => {
    if (!booking || !user) return false;
    return (
      isAdmin || booking.renter_id === user.id || booking.owner_id === user.id
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white flex flex-col items-center">
          <Clock className="animate-spin h-12 w-12 mb-4" />
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white flex flex-col items-center">
          <p className="text-red-400">{error || "Booking not found"}</p>
          <Button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!canViewBooking()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-white flex flex-col items-center">
          <p className="text-red-400">
            You don&apos;t have permission to view this booking
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl text-white">
      <Button
        variant="outline"
        className="mb-6 border-gray-700 text-gray-300 hover:text-white flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Booking ID</p>
            <p className="font-mono text-sm">{booking.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Booking Date</p>
            <p className="font-medium">
              {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg">Item Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <img
                  src={
                    booking.item?.image || "/placeholder.svg?height=96&width=96"
                  }
                  alt={booking.item?.name || "Item"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {booking.item?.name}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.item?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>₦{booking.item?.price}/day</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Renter Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Renter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">{booking.renter?.full_name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>{booking.renter?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{booking.renter?.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Rental Period</p>
                  <p className="font-medium">
                    {new Date(booking.start_date).toLocaleDateString()} -{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Duration</p>
                  <p className="font-medium">
                    {Math.ceil(
                      (new Date(booking.end_date) -
                        new Date(booking.start_date)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Information */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Payment Method</p>
                <p className="font-medium">
                  {booking.payment_method || "Cash"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="font-medium text-lg">₦{booking.total_price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 flex-wrap">
          {/* Owner/Admin actions for pending bookings */}
          {(isAdmin || booking.owner_id === user?.id) &&
            booking.status === "pending" && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAccept}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept Booking
                </Button>
                <Button
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Booking
                </Button>
              </div>
            )}

          {/* Return button for active/confirmed bookings */}
          {(isAdmin || booking.owner_id === user?.id) &&
            (booking.status === "active" || booking.status === "confirmed") && (
              <Button
                onClick={() => handleStatusUpdate("returned")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Mark as Returned
              </Button>
            )}

          {/* Cancel button for active bookings */}
          {(isAdmin || booking.renter_id === user?.id) &&
            (booking.status === "confirmed" ||
              booking.status === "pending") && (
              <Button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                Cancel Booking
              </Button>
            )}

          {/* Admin status dropdown */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Status:</label>
              <select
                value={booking.status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  handleStatusUpdate(newStatus);
                }}
                className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}

          {/* Debug button for admins */}
          {isAdmin && (
            <Button
              variant="outline"
              className="ml-2 border-gray-700 text-gray-300 hover:text-white"
              onClick={async () => {
                try {
                  const result = await diagnoseBookingPermissions(booking.id);
                  console.log("Permission diagnosis:", result);
                  toast.success(
                    `Diagnosis: Read: ${
                      result.canRead ? "Yes" : "No"
                    }, Write: ${result.canWrite ? "Yes" : "No"}`
                  );
                  if (!result.canWrite) {
                    toast.error(
                      `Write permission issue: ${
                        result.writeError || "Unknown"
                      }`
                    );
                  }
                } catch (err) {
                  console.error("Error diagnosing permissions:", err);
                  toast.error(`Diagnosis error: ${err.message}`);
                }
              }}
            >
              Diagnose Permissions
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
