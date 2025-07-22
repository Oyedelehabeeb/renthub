import { useState } from "react";
import { useUser } from "../features/authentication/useUser";
import { Link } from "react-router-dom";
import NotificationBell from "../features/notifications/NotificationBell";
import { useSignout } from "../features/authentication/useSignout";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user } = useUser();
  const { signOut, isSigningOut } = useSignout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSignOut = async () => {
    await signOut();
    // Close mobile menu if it was open
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow z-50 h-16 flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <span className="font-bold text-xl text-blue-600">Renthub</span>
        </Link>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={handleToggleMenu}
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6">
        <Link to="/" className="hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link to="/browse" className="hover:text-blue-600 font-medium">
          Browse
        </Link>
        <Link to="/about" className="hover:text-blue-600 font-medium">
          About
        </Link>
        <Link to="/contact" className="hover:text-blue-600 font-medium">
          Contact
        </Link>
      </nav>
      {/* Desktop User Info or Sign In Button */}
      <div className="hidden md:block">
        {user && user.user_metadata?.fullName ? (
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                {user.user_metadata?.avatar ? (
                  <img
                    src={user.user_metadata.avatar}
                    alt={user.user_metadata.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {user.user_metadata?.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {user?.user_metadata?.fullName}
              </span>
            </Link>

            <button
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 border border-gray-300 transition"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white">
          <div className="flex flex-col p-4">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-4 border-b border-gray-200 pb-4">
              <Link
                to="/"
                className="hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className="hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile User Controls */}
            <div className="pt-4">
              {user && user.user_metadata?.fullName ? (
                <div className="flex flex-col space-y-4">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:text-blue-500 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                      {user.user_metadata?.avatar ? (
                        <img
                          src={user.user_metadata.avatar}
                          alt={user.user_metadata.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {user.user_metadata?.fullName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span>{user?.user_metadata?.fullName}</span>
                  </Link>

                  <div className="flex items-center gap-2 py-2">
                    <NotificationBell />
                    <span className="text-sm text-gray-600">Notifications</span>
                  </div>

                  <button
                    className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 border border-gray-300 transition"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
