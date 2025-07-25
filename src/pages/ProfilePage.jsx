import { Helmet } from "react-helmet-async";
import ProfileDetails from "../features/profile/ProfileDetails";
import UserBookings from "../features/profile/UserBookings";
import UserAnalytics from "../features/profile/UserAnalytics";

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile | ServiceHub</title>
        <meta
          name="description"
          content="View and edit your ServiceHub profile"
        />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        {/* Header Section */}
        <section className="pt-24 pb-16 bg-gradient-to-b from-blue-900/20 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                My Profile
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Manage your account information and bookings
              </p>
            </div>
          </div>
        </section>

        {/* Profile Content Sections */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Analytics Section */}
              <UserAnalytics />

              {/* Bookings Section */}
              <UserBookings />

              {/* Profile Details Section */}
              <ProfileDetails />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
