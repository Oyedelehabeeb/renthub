import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Calendar, DollarSign, ArrowRight } from "lucide-react";

export default function BookingSuccessPage() {
  const location = useLocation();
  const { booking } = location.state || {};

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-gray-900/50 border border-gray-700 rounded-xl p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-6 text-red-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Booking Information Not Found
            </h1>
            <p className="text-gray-400 mb-8">
              We couldn&apos;t find your booking details. This could happen if
              you refreshed the page or accessed it directly.
            </p>
            <Link
              to="/profile"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
            >
              View Your Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(booking.start_date).toLocaleDateString();
  const endDate = new Date(booking.end_date).toLocaleDateString();
  const formattedPrice =
    booking.total_price?.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }) || "₦0";

  return (
    <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-900/50 border border-gray-700 rounded-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 text-green-400">
            <CheckCircle size={64} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Booking Successful!
          </h1>
          <p className="text-gray-300 text-center">
            Your booking has been confirmed. Please check your email for booking
            details.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">
              Booking Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Rental Period</p>
                  <p className="text-white font-medium">
                    {startDate} to {endDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-400 flex-shrink-0 mt-1"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                  <path d="M3 6h18"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Item</p>
                  <p className="text-white font-medium">
                    {booking.item_name} × {booking.quantity || 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₦{booking.item_price?.toLocaleString()} per unit
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-400 flex-shrink-0 mt-1"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                  <path d="M12 12h.01"></path>
                </svg>
                <div>
                  <p className="text-sm text-gray-400">Rental Duration</p>
                  <p className="text-white font-medium">
                    {booking.days || 1} {booking.days === 1 ? "day" : "days"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-white font-medium">{formattedPrice}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-5">
            <h2 className="text-xl font-bold text-white mb-4">
              Important Information
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <ArrowRight className="text-blue-400 flex-shrink-0 mt-1 w-5 h-5" />
                <span>
                  Return the item on time to avoid late fees (150% of daily rate
                  per day)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="text-blue-400 flex-shrink-0 mt-1 w-5 h-5" />
                <span>Handle the item with care to avoid damage charges</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="text-blue-400 flex-shrink-0 mt-1 w-5 h-5" />
                <span>
                  Contact the owner if you have any questions about the item
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Link
              to="/profile"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 py-3 text-center border border-gray-700"
            >
              View Your Bookings
            </Link>
            <Link
              to="/browse"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-center"
            >
              Browse More Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
