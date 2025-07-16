import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";

export default function App() {
  const queryClient = new QueryClient()
  return (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
    </BrowserRouter>
  </QueryClientProvider>
  )
}