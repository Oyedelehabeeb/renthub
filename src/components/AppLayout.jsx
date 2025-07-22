import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 bg-gray-50">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
