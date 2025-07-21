import { Helmet } from "react-helmet-async";
import ProfileDetails from "../../features/profile/ProfileDetails";

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile | RentHub</title>
        <meta name="description" content="View and edit your RentHub profile" />
      </Helmet>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">
          View and update your personal information
        </p>

        <ProfileDetails />
      </main>
    </>
  );
}
