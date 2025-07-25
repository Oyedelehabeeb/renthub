/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useUser } from "../authentication/useUser";
import { supabase } from "../../lib/supabase";
import {
  CalendarCheck,
  Clock,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function UserAnalytics() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    additionalFees: 0,
    servicesProvided: 0,
    servicesBooked: 0,
    averageServiceDuration: 0,
    mostBookedCategory: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return;

      try {
        // Get all user bookings
        const { data: bookings, error: bookingsError } = await supabase
          .from("bookings")
          .select("*, items(*)")
          .eq("renter_id", user.id);

        if (bookingsError) throw bookingsError;

        // Get services provided by user
        const { data: ownedServices, error: servicesError } = await supabase
          .from("services")
          .select("id")
          .eq("provider_id", user.id);

        if (servicesError) throw servicesError;

        // Calculate analytics
        const activeBookings =
          bookings?.filter((b) =>
            ["pending", "confirmed", "active"].includes(b.status)
          ) || [];

        const completedBookings =
          bookings?.filter((b) => ["completed"].includes(b.status)) || [];

        const totalSpent =
          bookings?.reduce(
            (sum, booking) => sum + (booking.total_price || 0),
            0
          ) || 0;
        const additionalFees =
          bookings?.reduce(
            (sum, booking) => sum + (booking.late_fee || 0),
            0
          ) || 0;

        // Calculate average service duration in days
        let totalDuration = 0;
        completedBookings.forEach((booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);
          const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // days
          totalDuration += duration;
        });

        const averageServiceDuration = completedBookings.length
          ? Math.round(totalDuration / completedBookings.length)
          : 0;

        // Find most frequently booked service category
        const serviceCategories = bookings
          ?.filter((b) => b.items?.category)
          .map((b) => b.items.category);

        const categoryCounts = serviceCategories?.reduce((acc, category) => {
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const mostBookedCategory = Object.entries(categoryCounts || {})
          .sort((a, b) => b[1] - a[1])
          .shift();

        setAnalytics({
          totalBookings: bookings?.length || 0,
          activeBookings: activeBookings.length,
          totalSpent,
          additionalFees,
          servicesProvided: ownedServices?.length || 0,
          servicesBooked: completedBookings.length,
          averageServiceDuration,
          mostBookedCategory: mostBookedCategory ? mostBookedCategory[0] : null,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setAnalytics((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchAnalytics();
  }, [user?.id]);

  if (analytics.isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h2 className="text-2xl font-semibold mb-6">My Analytics</h2>
        <div className="h-40 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Using a function component with explicit class mapping
  function StatCard({ icon: Icon, label, value, color = "blue" }) {
    const bgColorMap = {
      blue: "bg-blue-500/20",
      green: "bg-green-500/20",
      purple: "bg-purple-500/20",
      red: "bg-red-500/20",
    };

    const textColorMap = {
      blue: "text-blue-400",
      green: "text-green-400",
      purple: "text-purple-400",
      red: "text-red-400",
    };

    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div
          className={`w-10 h-10 rounded-lg ${
            bgColorMap[color] || bgColorMap.blue
          } flex items-center justify-center mb-3`}
        >
          <Icon
            className={`h-5 w-5 ${textColorMap[color] || textColorMap.blue}`}
          />
        </div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-xl font-semibold text-white">{value}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">My Analytics</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Package}
            label="Total Bookings"
            value={analytics.totalBookings}
            color="blue"
          />
          <StatCard
            icon={Clock}
            label="Active Bookings"
            value={analytics.activeBookings}
            color="green"
          />
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={`₦${analytics.totalSpent.toLocaleString()}`}
            color="purple"
          />
          <StatCard
            icon={AlertTriangle}
            label="Additional Fees"
            value={`₦${analytics.additionalFees.toLocaleString()}`}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <h3 className="font-medium">Service Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-gray-400 text-sm">Services Booked</p>
                <p className="text-xl font-semibold text-white">
                  {analytics.servicesBooked}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Services Provided</p>
                <p className="text-xl font-semibold text-white">
                  {analytics.servicesProvided}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="h-5 w-5 text-green-400" />
              <h3 className="font-medium">Average Duration</h3>
            </div>
            <p className="text-gray-400 text-sm mt-4">Avg. Service Time</p>
            <p className="text-xl font-semibold text-white">
              {analytics.averageServiceDuration} days
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="font-medium">Popular Category</h3>
            </div>
            <p className="text-gray-400 text-sm mt-4">Most Booked</p>
            <p className="text-xl font-semibold text-white capitalize">
              {analytics.mostBookedCategory || "None"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
