import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { useNavigate, Link } from "react-router-dom";
import {
  useAdminCheck,
  useBookings,
  useBookingStats,
  useMonthlyStats,
  useUpdateBookingStatus,
  useGetAllUsers,
  useUpdateUserAdminStatus,
} from "./useAdmin";
import { useUnreadNotificationCount } from "../notifications/useNotification";
// Table components using built-in HTML elements with styling
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Separator } from "../../components/ui/separator";
import {
  Activity,
  Calendar,
  Search,
  X,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  Clock,
  CreditCard,
  Bell,
} from "lucide-react";

// Type definitions for improved code organization
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
    statusColors[status.toLowerCase()] ||
    "bg-gray-500/20 text-gray-400 border-gray-500/30"
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const { mutate: updateBookingStatus } = useUpdateBookingStatus();
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCount();
  const { mutate: updateUserAdmin } = useUpdateUserAdminStatus();
  const { data: usersData = [], isLoading: isLoadingUsers } = useGetAllUsers();

  // Check if user is admin
  const { isLoading: isCheckingAdmin, isError: isAdminError } = useAdminCheck();

  // Fetch data using React Query with pagination
  const {
    data: bookingsData = {
      bookings: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
    },
    isLoading: isLoadingBookings,
  } = useBookings({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction,
    dateRange,
    status: filterStatus === "all" ? null : filterStatus,
  });

  // Debug booking data
  console.log("Bookings data:", bookingsData);

  const {
    data: stats = {
      totalBookings: 0,
      activeBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
    },
    isLoading: isLoadingStats,
  } = useBookingStats();

  // Debug stats data
  console.log("Stats data:", stats);
  const { data: monthlyStats = [], isLoading: isLoadingMonthly } =
    useMonthlyStats();

  // If not admin, redirect to home and log the error
  if (isAdminError) {
    console.error("Admin check failed");
    navigate("/");
    return null;
  }

  // Add error boundary for data loading
  if (isLoadingBookings || isLoadingStats || isLoadingMonthly) {
    console.log("Loading data...");
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <p className="text-white">Loading dashboard data...</p>
      </div>
    );
  }

  if (!bookingsData?.bookings || !stats || !monthlyStats) {
    console.error("Data not available:", { bookingsData, stats, monthlyStats });
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <p className="text-red-400">
          Error loading dashboard data. Please try again.
        </p>
      </div>
    );
  }

  // Loading state
  const isLoading =
    isCheckingAdmin ||
    isLoadingBookings ||
    isLoadingStats ||
    isLoadingMonthly ||
    isLoadingUsers;

  const maxMonthCount = Math.max(...monthlyStats.map((item) => item.count));
  const maxMonthRevenue = Math.max(...monthlyStats.map((item) => item.revenue));

  // Make sure bookings array exists before filtering
  const bookings = bookingsData?.bookings || [];
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.renter?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex items-center justify-center">
        <p className="text-white">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Booking Dashboard</h1>
            <p className="text-gray-400">Manage and track all your bookings</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Link
                to="/notifications"
                className="text-gray-400 hover:text-white"
              >
                <Bell className="h-6 w-6" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats?.totalBookings || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Active Bookings
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeBookings}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.pendingBookings}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Monthly Trends */}
        <Card className="bg-gray-900/50 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-blue-400">
                    Bookings
                  </span>
                  <span className="text-sm text-gray-400">
                    Max: {maxMonthCount}
                  </span>
                </div>
                <div className="relative h-20 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-end justify-between h-full">
                    {monthlyStats.map((item, index) => {
                      const height =
                        maxMonthCount > 0
                          ? (item.count / maxMonthCount) * 100
                          : 0;
                      return (
                        <div
                          key={`bookings-${index}`}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div className="relative w-full max-w-8 bg-gray-700 rounded-t">
                            <div
                              className="bg-blue-500 rounded-t transition-all duration-500 ease-out"
                              style={{
                                height: `${height}%`,
                                minHeight: item.count > 0 ? "4px" : "0",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-green-400">
                    Revenue ($)
                  </span>
                  <span className="text-sm text-gray-400">
                    Max: ${maxMonthRevenue}
                  </span>
                </div>
                <div className="relative h-20 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-end justify-between h-full">
                    {monthlyStats.map((item, index) => {
                      const height =
                        maxMonthRevenue > 0
                          ? (item.revenue / maxMonthRevenue) * 100
                          : 0;
                      return (
                        <div
                          key={`revenue-${index}`}
                          className="flex flex-col items-center gap-2 flex-1"
                        >
                          <div className="relative w-full max-w-8 bg-gray-700 rounded-t">
                            <div
                              className="bg-green-500 rounded-t transition-all duration-500 ease-out"
                              style={{
                                height: `${height}%`,
                                minHeight: item.revenue > 0 ? "4px" : "0",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Bookings Data Table */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              All Bookings
              <span className="text-blue-400">
                ({bookingsData?.totalCount || bookingsData.bookings.length || 0}
                )
              </span>
            </CardTitle>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex gap-2 flex-grow md:flex-grow-0">
                  <Input
                    type="date"
                    value={dateRange.start || ""}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="bg-gray-800 border-gray-700 text-white w-full md:w-auto"
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={dateRange.end || ""}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="bg-gray-800 border-gray-700 text-white w-full md:w-auto"
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-700 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-700 hover:bg-gray-800/50">
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer"
                      onClick={() =>
                        setSortConfig({
                          key: "item_name",
                          direction:
                            sortConfig.key === "item_name" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        Item
                        {sortConfig.key === "item_name" && (
                          <span>
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer"
                      onClick={() =>
                        setSortConfig({
                          key: "renter_name",
                          direction:
                            sortConfig.key === "renter_name" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        Renter
                        {sortConfig.key === "renter_name" && (
                          <span>
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer"
                      onClick={() =>
                        setSortConfig({
                          key: "start_date",
                          direction:
                            sortConfig.key === "start_date" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        Dates
                        {sortConfig.key === "start_date" && (
                          <span>
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer"
                      onClick={() =>
                        setSortConfig({
                          key: "status",
                          direction:
                            sortConfig.key === "status" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortConfig.key === "status" && (
                          <span>
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left py-3 px-4 text-gray-300 font-medium cursor-pointer"
                      onClick={() =>
                        setSortConfig({
                          key: "total_price",
                          direction:
                            sortConfig.key === "total_price" &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <div className="flex items-center gap-1">
                        Total
                        {sortConfig.key === "total_price" && (
                          <span>
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-700 hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md overflow-hidden">
                              <img
                                src={
                                  booking.item?.image ||
                                  "/placeholder.svg?height=40&width=40"
                                }
                                alt={booking.item?.name || "Item"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">
                                {booking.item?.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {booking.item?.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div>
                            <div className="font-medium">
                              {booking.renter?.full_name}
                            </div>
                            <div className="text-sm text-gray-400">
                              {booking.renter?.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="text-sm">
                            <div>
                              {new Date(
                                booking.start_date
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-gray-400">
                              to{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-medium">
                          ${booking.total_price}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between px-4 gap-4">
                <div className="text-sm text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredBookings.length
                  )}{" "}
                  of {filteredBookings.length} bookings
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 flex-wrap">
                    {Array.from(
                      {
                        length: Math.ceil(
                          filteredBookings.length / itemsPerPage
                        ),
                      },
                      (_, i) => (
                        <Button
                          key={i + 1}
                          variant={
                            currentPage === i + 1 ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(i + 1)}
                          className={
                            currentPage === i + 1
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "border-gray-600 text-gray-300 hover:bg-gray-800"
                          }
                        >
                          {i + 1}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          Math.ceil(filteredBookings.length / itemsPerPage),
                          prev + 1
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredBookings.length / itemsPerPage)
                    }
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management Section */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              User Management
              <span className="text-blue-400">({usersData?.length || 0})</span>
            </CardTitle>
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white w-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-700 overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-700 hover:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Avatar
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Admin Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersData
                    .filter(
                      (user) =>
                        user.full_name
                          ?.toLowerCase()
                          .includes(userSearchTerm.toLowerCase()) ||
                        user.email
                          ?.toLowerCase()
                          .includes(userSearchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-700 hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          <div className="font-medium">
                            {user.full_name || "Unknown"}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-300">
                          {user.is_admin ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Admin
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                              User
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateUserAdmin({
                                userId: user.id,
                                isAdmin: !user.is_admin,
                              });
                            }}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          >
                            {user.is_admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <Dialog
            open={!!selectedBooking}
            onOpenChange={() => setSelectedBooking(null)}
          >
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Booking Details</DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Booking ID</p>
                    <p className="font-mono text-sm">{selectedBooking.id}</p>
                  </div>
                  <Badge className={getStatusColor(selectedBooking.status)}>
                    {selectedBooking.status.charAt(0).toUpperCase() +
                      selectedBooking.status.slice(1)}
                  </Badge>
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
                            selectedBooking.item?.image ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt={selectedBooking.item?.name || "Item"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {selectedBooking.item?.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{selectedBooking.item?.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span>${selectedBooking.item?.price}/day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold">
                            {selectedBooking.renter?.full_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{selectedBooking.renter?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span>{selectedBooking.renter?.phone}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Booking Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400">Rental Period</p>
                          <p className="font-medium">
                            {new Date(
                              selectedBooking.start_date
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              selectedBooking.end_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Total Duration
                          </p>
                          <p className="font-medium">
                            {Math.ceil(
                              (new Date(selectedBooking.end_date) -
                                new Date(selectedBooking.start_date)) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Booking Date</p>
                          <p className="font-medium">
                            {new Date(
                              selectedBooking.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

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
                          {selectedBooking.payment_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Total Amount</p>
                        <p className="font-medium text-lg">
                          ${selectedBooking.total_price}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedBooking.special_requests && (
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Special Requests
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        {selectedBooking.special_requests}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-3">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <label className="text-sm text-gray-400">
                        Update Status:
                      </label>
                      <select
                        value={selectedBooking.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          updateBookingStatus({
                            bookingId: selectedBooking.id,
                            status: newStatus,
                          });
                          setSelectedBooking((prev) => ({
                            ...prev,
                            status: newStatus,
                          }));
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
                    <div className="flex gap-3 flex-wrap">
                      {selectedBooking.status === "pending" && (
                        <>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              updateBookingStatus({
                                bookingId: selectedBooking.id,
                                status: "confirmed",
                              });
                              setSelectedBooking((prev) => ({
                                ...prev,
                                status: "confirmed",
                              }));
                            }}
                          >
                            Accept Booking
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              updateBookingStatus({
                                bookingId: selectedBooking.id,
                                status: "rejected",
                              });
                              setSelectedBooking((prev) => ({
                                ...prev,
                                status: "rejected",
                              }));
                            }}
                          >
                            Reject Booking
                          </Button>
                        </>
                      )}

                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          updateBookingStatus({
                            bookingId: selectedBooking.id,
                            status: "cancelled",
                          });
                          setSelectedBooking((prev) => ({
                            ...prev,
                            status: "cancelled",
                          }));
                        }}
                        disabled={
                          selectedBooking.status === "cancelled" ||
                          selectedBooking.status === "completed" ||
                          selectedBooking.status === "rejected"
                        }
                      >
                        Cancel Booking
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Contact Renter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
