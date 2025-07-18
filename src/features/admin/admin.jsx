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
} from "lucide-react";

// Sample data for demonstration
const sampleBookings = [
  {
    id: "BK001",
    item: {
      name: "Professional Camera Kit",
      location: "Downtown Studio",
      price: 150,
      image: "/placeholder.svg?height=40&width=40",
    },
    renter: {
      full_name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
    },
    start_date: "2024-07-20",
    end_date: "2024-07-25",
    status: "confirmed",
    total_price: 750,
    created_at: "2024-07-15T10:30:00Z",
    payment_method: "Credit Card",
    special_requests: "Need delivery to hotel",
  },
  {
    id: "BK002",
    item: {
      name: "DJ Equipment Set",
      location: "Music District",
      price: 200,
      image: "/placeholder.svg?height=40&width=40",
    },
    renter: {
      full_name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 987-6543",
    },
    start_date: "2024-07-22",
    end_date: "2024-07-23",
    status: "completed",
    total_price: 400,
    created_at: "2024-07-10T14:15:00Z",
    payment_method: "PayPal",
    special_requests: null,
  },
  {
    id: "BK003",
    item: {
      name: "Wedding Decoration Package",
      location: "Event Center",
      price: 300,
      image: "/placeholder.svg?height=40&width=40",
    },
    renter: {
      full_name: "Mike Chen",
      email: "mike.chen@email.com",
      phone: "+1 (555) 456-7890",
    },
    start_date: "2024-07-28",
    end_date: "2024-07-29",
    status: "pending",
    total_price: 600,
    created_at: "2024-07-16T09:20:00Z",
    payment_method: "Bank Transfer",
    special_requests: "Setup assistance required",
  },
];

// Monthly data processing
const processMonthlyData = (bookings) => {
  const monthlyData = {};

  bookings.forEach((booking) => {
    const month = new Date(booking.start_date).toLocaleDateString("en-US", {
      month: "short",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { count: 0, revenue: 0 };
    }
    monthlyData[month].count += 1;
    monthlyData[month].revenue += booking.total_price;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    count: data.count,
    revenue: data.revenue,
  }));
};

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const bookings = sampleBookings;
  const bookingsByMonth = processMonthlyData(bookings);
  const maxMonthCount = Math.max(...bookingsByMonth.map((item) => item.count));
  const maxMonthRevenue = Math.max(
    ...bookingsByMonth.map((item) => item.revenue)
  );

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.renter?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "completed":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Booking Dashboard</h1>
            <p className="text-gray-400">Manage and track all your bookings</p>
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
                    {bookings.length}
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
                    {
                      bookings.filter(
                        (b) => b.status === "confirmed" || b.status === "active"
                      ).length
                    }
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
                    ${bookings.reduce((sum, b) => sum + b.total_price, 0)}
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
                    {bookings.filter((b) => b.status === "pending").length}
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
                    {bookingsByMonth.map((item, index) => {
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
                    {bookingsByMonth.map((item, index) => {
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
              All Bookings ({bookings.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-700">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 hover:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Renter
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Dates
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
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
                            {new Date(booking.start_date).toLocaleDateString()}
                          </div>
                          <div className="text-gray-400">
                            to {new Date(booking.end_date).toLocaleDateString()}
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
                        Renter Information
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
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Edit Booking
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Contact Renter
                  </Button>
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
