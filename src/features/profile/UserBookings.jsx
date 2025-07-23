import { useState, useEffect } from "react";
import { useUser } from "../authentication/useUser";
import { useBookingsByRenter } from "../booking/useBooking";
import {
  Loader2,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";

// Status colors for badges
const statusColors = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  returned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function UserBookings() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("active");
  const { data: bookings, isLoading } = useBookingsByRenter(user?.id);

  // Log bookings for debugging
  useEffect(() => {
    if (bookings) {
      console.log("All bookings:", bookings);
      console.log(
        "Active bookings:",
        bookings.filter((b) =>
          ["pending", "confirmed", "active"].includes(b.status)
        )
      );

      // Check for potential data issues
      bookings.forEach((booking, index) => {
        if (!booking.item && !booking.items) {
          console.warn(`Booking ${index} has no item data:`, booking);
        }
      });
    }
  }, [bookings]);

  // Filter bookings based on active tab
  const filteredBookings = bookings?.filter((booking) => {
    if (activeTab === "active") {
      return ["pending", "confirmed", "active"].includes(booking.status);
    }
    if (activeTab === "completed") {
      return ["completed", "returned"].includes(booking.status);
    }
    if (activeTab === "cancelled") {
      return ["cancelled", "rejected"].includes(booking.status);
    }
    return true;
  });

  // Check if there are late returns
  const hasLateReturns = bookings?.some((booking) => {
    if (
      booking.status !== "returned" &&
      booking.status !== "cancelled" &&
      booking.status !== "rejected"
    ) {
      const endDate = new Date(booking.end_date);
      const today = new Date();
      return today > endDate;
    }
    return false;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

        {hasLateReturns && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-red-400 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-400">Late Return Warning</h3>
              <p className="text-sm text-gray-300">
                You have items past their due date. Return them as soon as
                possible to avoid additional late fees.
              </p>
            </div>
          </div>
        )}

        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "active"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "completed"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "cancelled"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {!filteredBookings?.length ? (
          <div className="text-center py-10">
            <div className="flex justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === "active" &&
                "You don't have any active bookings at the moment."}
              {activeTab === "completed" &&
                "You haven't completed any bookings yet."}
              {activeTab === "cancelled" &&
                "You don't have any cancelled bookings."}
            </p>
            <Link
              to="/browse"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg inline-block"
            >
              Browse Items to Rent
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => {
              const startDate = new Date(
                booking.start_date
              ).toLocaleDateString();
              const endDate = new Date(booking.end_date).toLocaleDateString();
              const isLate =
                booking.status !== "returned" &&
                booking.status !== "cancelled" &&
                booking.status !== "rejected" &&
                new Date() > new Date(booking.end_date);

              return (
                <Link
                  to={`/bookings/${booking.id}`}
                  key={booking.id}
                  className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4 transition-all"
                >
                  <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        (booking.item || booking.items)?.image ||
                        "/placeholder.svg"
                      }
                      alt={(booking.item || booking.items)?.name || "Item"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between flex-wrap gap-2 mb-2">
                      <h3 className="font-medium text-lg text-white">
                        {(booking.item || booking.items)?.name ||
                          "Unnamed Item"}
                      </h3>
                      <Badge
                        className={
                          statusColors[booking.status] ||
                          "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          {startDate} - {endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">
                          ₦{booking.total_price}
                        </span>
                      </div>
                      {booking.late_fee > 0 && (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Late Fee: ₦{booking.late_fee}</span>
                        </div>
                      )}
                      {isLate && (
                        <div className="flex items-center gap-2 text-red-400">
                          <Clock className="h-4 w-4" />
                          <span>Overdue!</span>
                        </div>
                      )}
                      {booking.status === "returned" && !booking.late_fee && (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span>Returned on time</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
