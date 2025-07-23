/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";

// Spinner component for loading animation
const Spinner = () => (
  <div className="w-12 h-12 relative">
    <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-blue-500 border-l-purple-500 animate-spin"></div>
    <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-4 border-t-transparent border-r-transparent border-b-transparent border-l-blue-400 animate-pulse"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(
    function () {
      if (!isLoading && !isAuthenticated) {
        navigate("/login", { replace: true });
      }
    },
    [isLoading, isAuthenticated, navigate]
  );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-950 p-6 flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-white mt-4 text-lg font-medium">Authenticating...</p>
      </div>
    );

  if (isAuthenticated) return children;
};

export default ProtectedRoute;
