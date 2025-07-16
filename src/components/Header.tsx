import React from "react";
import { signOut } from "../services/apiAuth";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";

export default function Header() {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50 h-16 flex items-center justify-between px-8">
      {/* Logo */}
      <div className="flex items-center">
        <span className="font-bold text-xl text-blue-600">Renthub</span>
      </div>
      {/* Navigation */}
      <nav className="flex gap-6">
        <Link to="/" className="hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link to="/browse" className="hover:text-blue-600 font-medium">
          Browse
        </Link>
        <Link to="/booking" className="hover:text-blue-600 font-medium">
          Booking
        </Link>
        <Link to="/contact" className="hover:text-blue-600 font-medium">
          Contact
        </Link>
      </nav>
      {/* User Info or Sign In Button */}
      {user && user.user_metadata?.fullName ? (
        <div className="flex items-center gap-3">
          <img
            src={user.user_metadata.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <button
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 border border-gray-300 transition"
            onClick={async () => {
              try {
                await signOut();
                navigate("/")
              } catch (err) {
                alert("Sign out failed");
              }
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
}
