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
// import { Separator } from "../components/ui/separator";
import {
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  ArrowLeft,
  // Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
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

// Helper function to format currency
const formatCurrency = (amount) => {
  return `₦${amount?.toLocaleString() || 0}`;
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAdmin } = useUser();
  const { mutate: updateBookingStatus } = useUpdateBookingStatus();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
      isOwner: booking.provider_id === user?.id,
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
            cancelled: "Service booking cancelled successfully",
            confirmed: "Service booking accepted successfully",
            rejected: "Service booking rejected successfully",
            completed: "Service marked as completed successfully",
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
  const handleComplete = () => handleStatusUpdate("completed");

  // Check if user has permission to view this booking
  const canViewBooking = () => {
    if (!booking || !user) return false;
    return (
      isAdmin ||
      booking.client_id === user.id ||
      booking.provider_id === user.id
    );
  };

  // Calculate service duration in days
  const calculateDuration = () => {
    if (!booking) return 0;

    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const diffTime = endDate - startDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if service period is overdue
  const isOverdue =
    booking &&
    ["pending", "confirmed", "active"].includes(booking.status) &&
    new Date() > new Date(booking.end_date);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white flex flex-col items-center">
          <div className="w-12 h-12 relative">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-blue-500 border-l-purple-500 animate-spin"></div>
            <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-4 border-t-transparent border-r-transparent border-b-transparent border-l-blue-400 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-300">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white flex flex-col items-center p-8 max-w-md bg-gray-900 rounded-2xl border border-gray-800">
          <AlertTriangle className="text-red-400 h-12 w-12 mb-4" />
          <p className="text-red-400 text-lg font-medium mb-2">
            Service Booking Not Found
          </p>
          <p className="text-gray-400 text-center mb-6">
            {error || "The service booking details couldn't be loaded."}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!canViewBooking()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white flex flex-col items-center p-8 max-w-md bg-gray-900 rounded-2xl border border-gray-800">
          <ShieldCheck className="text-red-400 h-12 w-12 mb-4" />
          <p className="text-red-400 text-lg font-medium mb-2">Access Denied</p>
          <p className="text-gray-400 text-center mb-6">
            You don&apos;t have permission to view this service booking
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const serviceDuration = calculateDuration();
  const service = booking.service || booking.services;
  const serviceProvider = booking.provider;
  const serviceRequester = booking.client;

  return (
    <div className="min-h-screen bg-black pt-16 pb-16 px-4">
      <div className="max-w-5xl mx-auto mt-4 text-white">
        <Button
          variant="outline"
          className="mb-6 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Service Booking Details
            </h1>
            <Badge
              className={`text-sm px-3 py-1 ${getStatusColor(booking.status)}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <div>
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="font-mono text-sm text-gray-200">{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Booking Date</p>
              <p className="font-medium text-gray-200">
                {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Service period ended</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Service Details */}
              <Card className="bg-gray-900 border-gray-800 shadow-xl rounded-2xl overflow-hidden mb-6">
                <div className="relative h-48">
                  <img
                    src={service?.image || "/placeholder.svg"}
                    alt={service?.name || "Service"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-6">
                      <span className="inline-block bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-700/30 mb-2">
                        {service?.category || "Service"}
                      </span>
                      <h2 className="text-2xl font-bold text-white">
                        {service?.name || "Service Details"}
                      </h2>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Service Period
                      </h3>
                      <div className="space-y-3 text-gray-300">
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="font-medium">
                            {new Date(booking.start_date).toLocaleDateString()}{" "}
                            - {new Date(booking.end_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Duration
                          </p>
                          <p className="font-medium">
                            {serviceDuration}{" "}
                            {serviceDuration === 1 ? "day" : "days"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        Service Location
                      </h3>
                      <div className="space-y-2">
                        <p className="text-gray-300">
                          {service?.location || "Location not specified"}
                        </p>
                        {service?.description && (
                          <p className="text-sm text-gray-400 mt-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* People Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Service Provider Information */}
                <Card className="bg-gray-900 border-gray-800 shadow-xl rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Service Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-white">
                          {serviceProvider?.full_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{serviceProvider?.email}</span>
                      </div>
                      {serviceProvider?.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{serviceProvider.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Service Requester Information */}
                <Card className="bg-gray-900 border-gray-800 shadow-xl rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-white">
                          {serviceRequester?.full_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{serviceRequester?.email}</span>
                      </div>
                      {serviceRequester?.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{serviceRequester.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Late Fee Warning */}
              {booking.late_fee > 0 && (
                <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-red-400 mb-1">
                        Additional Fee Applied
                      </h3>
                      <p className="text-gray-300 mb-2">
                        This booking incurred an additional fee because the
                        service period was exceeded.
                      </p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-red-400" />
                        <span className="text-red-300 font-medium">
                          Additional Fee: {formatCurrency(booking.late_fee)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {/* Payment Information */}
              <Card className="bg-gray-900 border-gray-800 shadow-xl rounded-xl mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Service Fee</span>
                      <span className="text-white font-medium">
                        {formatCurrency(service?.price || 0)}
                      </span>
                    </div>

                    {booking.quantity > 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Quantity</span>
                        <span className="text-white font-medium">
                          × {booking.quantity}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration</span>
                      <span className="text-white font-medium">
                        {serviceDuration}{" "}
                        {serviceDuration === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {booking.service_fee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Platform Fee</span>
                        <span className="text-white font-medium">
                          {formatCurrency(booking.service_fee)}
                        </span>
                      </div>
                    )}

                    {booking.late_fee > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>Additional Fee</span>
                        <span className="font-medium">
                          {formatCurrency(booking.late_fee)}
                        </span>
                      </div>
                    )}

                    <div className="border-t border-gray-700 pt-3 flex justify-between">
                      <span className="text-white font-medium">
                        Total Amount
                      </span>
                      <span className="text-white font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        className={
                          booking.payment_status
                            ? "h-4 w-4 text-green-400"
                            : "h-4 w-4 text-gray-400"
                        }
                      />
                      <span className="text-gray-300 text-sm">
                        Payment Status:{" "}
                        <span
                          className={
                            booking.payment_status
                              ? "text-green-400"
                              : "text-yellow-400"
                          }
                        >
                          {booking.payment_status ? "Paid" : "Pending"}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gray-900 border-gray-800 shadow-xl rounded-xl">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  {showCancelConfirm ? (
                    <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700">
                      <h4 className="text-lg font-medium text-white mb-2">
                        Confirm Cancellation
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Are you sure you want to cancel this service booking?
                        This action cannot be undone.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleCancel}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Yes, Cancel Service
                        </Button>
                        <Button
                          onClick={() => setShowCancelConfirm(false)}
                          className="bg-gray-700 hover:bg-gray-600 text-white"
                        >
                          No, Keep Service
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {/* Provider/Admin actions for pending bookings */}
                      {(isAdmin || booking.provider_id === user?.id) &&
                        booking.status === "pending" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Button
                              onClick={handleAccept}
                              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                            >
                              Accept Service
                            </Button>
                            <Button
                              onClick={handleReject}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Reject Service
                            </Button>
                          </div>
                        )}

                      {/* Complete button for active/confirmed bookings */}
                      {(isAdmin || booking.provider_id === user?.id) &&
                        (booking.status === "active" ||
                          booking.status === "confirmed") && (
                          <Button
                            onClick={handleComplete}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                          >
                            Mark as Completed
                          </Button>
                        )}

                      {/* Cancel button for active bookings */}
                      {(isAdmin || booking.client_id === user?.id) &&
                        (booking.status === "confirmed" ||
                          booking.status === "pending") && (
                          <Button
                            onClick={() => setShowCancelConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Cancel Service
                          </Button>
                        )}

                      {/* Admin status dropdown */}
                      {isAdmin && (
                        <div className="mt-4 flex items-center gap-3">
                          <label className="text-sm text-gray-400">
                            Admin Status Control:
                          </label>
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
                          className="mt-2 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                          onClick={async () => {
                            try {
                              const result = await diagnoseBookingPermissions(
                                booking.id
                              );
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
                              console.error(
                                "Error diagnosing permissions:",
                                err
                              );
                              toast.error(`Diagnosis error: ${err.message}`);
                            }
                          }}
                        >
                          Diagnose Permissions
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
