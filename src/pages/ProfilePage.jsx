import { Helmet } from "react-helmet-async";
import ProfileDetails from "../features/profile/ProfileDetails";

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile | RentHub</title>
        <meta name="description" content="View and edit your RentHub profile" />
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
                Manage your account information and preferences
              </p>
            </div>
          </div>
        </section>

        {/* Profile Details Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileDetails />
          </div>
        </section>
      </div>
    </>
  );
}
