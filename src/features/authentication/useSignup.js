import { useMutation } from "@tanstack/react-query";

import { signup as signupApi } from "../../services/apiAuth";
import { createProfile } from "../../services/apiProfile";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useSignup() {
  const navigate = useNavigate();
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: signupApi,

    onSuccess: async (user) => {
      try {
        // Supabase returns user object under user.user
        const { id, user_metadata } = user.user;
        await createProfile({
          id,
          full_name: user_metadata?.fullName || "",
          avatar_url: user_metadata?.avatar || "",
        });
      } catch (err) {
        toast.error(
          "Profile creation failed: " + (err.message || "Unknown error")
        );
      }
      navigate("/", { replace: true });
      console.log(user);
      toast.success("Account created successfully!");
    },
  });

  return { signup, isLoading };
}
