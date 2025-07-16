import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import { Toaster } from "react-hot-toast";
import BookingPage from "./pages/BookingPage";
import BrowsePage from "./pages/BrowsePage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const queryClient = new QueryClient()
  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/contact" element={<ContactPage />} />
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
            backgroundColor: "var(--color-grey-700)",
            color: "var(--color-grey-0)",
          },
        }}
      />
  </QueryClientProvider>
  )
}