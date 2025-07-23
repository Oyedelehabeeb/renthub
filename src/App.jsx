import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

import { Toaster } from "react-hot-toast";
import AppLayout from "./components/AppLayout";
import BookingPage from "./pages/BookingPage";
import BookingDetailPage from "./pages/BookingDetailPage";
import ItemPage from "./pages/ItemPage";
import BrowsePage from "./pages/BrowsePage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ListItemPage from "./pages/ListItemPage";
import AdminPages from "./pages/AdminPages";
import NotificationsPage from "./pages/NotificationsPage";
import NotificationTester from "./components/NotificationTester";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/item/:id" element={<ItemPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/list-item" element={<ListItemPage />} />
            <Route path="/admin" element={<AdminPages />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/bookings/:id" element={<BookingDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/debug-notifications"
              element={<NotificationTester />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 4000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "",
          },
        }}
      />
    </QueryClientProvider>
  );
}
