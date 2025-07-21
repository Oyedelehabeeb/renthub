import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 pb-16 bg-gray-50">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow h-16 flex items-center justify-center z-40">
        Copyright &copy; {new Date().getFullYear()} Renthub
      </footer>
    </div>
  );
}
