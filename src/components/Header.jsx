import { useState } from "react";
import { useUser } from "../features/authentication/useUser";
import { Link } from "react-router-dom";
import NotificationBell from "../features/notifications/notification-bell";
import { useSignout } from "../features/authentication/useSignout";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Header() {
  const { user, isAdmin } = useUser();
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
    <header className="fixed top-0 left-0 w-full bg-gray-900 shadow z-50 h-16 flex items-center justify-between px-4 md:px-8">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-bold text-white">RentHub</span>
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
        <Link to="/" className="text-white hover:text-blue-600 font-medium">
          Home
        </Link>
        <Link
          to="/browse"
          className="text-white hover:text-blue-600 font-medium"
        >
          Browse
        </Link>
        <Link
          to="/about"
          className="text-white hover:text-blue-600 font-medium"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-white hover:text-blue-600 font-medium"
        >
          Contact
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className="text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium flex items-center gap-1 px-3 py-1 rounded-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        )}
      </nav>
      {/* Desktop User Info or Sign In Button */}
      <div className="hidden md:block">
        {user && user.user_metadata?.fullName ? (
          <div className="flex items-center gap-3">
            {/* Signout button */}

            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-1"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center">
                {user.user_metadata?.avatar ? (
                  <img
                    src={user.user_metadata.avatar}
                    alt={user.user_metadata.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user?.user_metadata?.fullName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-white hidden sm:inline">
                {user?.user_metadata?.fullName}
              </span>
            </Link>

            {/* Notification Bell */}
            <NotificationBell />
          </div>
        ) : (
          <div>
            <Link to="/login">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-1">
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
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-blue-600 font-medium py-2 flex items-center gap-2 text-blue-600 bg-blue-50 rounded-md px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
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
                        <span className="text-white font-medium">
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
