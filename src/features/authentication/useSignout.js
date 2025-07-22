import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signOut as apiSignOut } from "../../services/apiAuth";
import { useQueryClient } from "@tanstack/react-query";

export function useSignout() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    try {
      setIsSigningOut(true);
      await apiSignOut();

      // Clear all React Query cache to remove user data
      queryClient.clear();

      // Reset any user-related state
      queryClient.setQueryData(["user"], null);

      // Navigate to home page
      navigate("/");

      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Sign out failed");
      console.error("Sign out error:", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  return { signOut, isSigningOut };
}
