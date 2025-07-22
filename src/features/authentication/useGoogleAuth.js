import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useGoogleAuth() {
  const { mutate: googleSignIn, isLoading } = useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: () => {
      // Since Google OAuth is a redirect flow, we don't need to navigate here
      // The user will be redirected back to the redirectTo URL after authentication
      toast.success("Google authentication initiated");
    },
    onError: (err) => {
      toast.error(err.message || "Error connecting to Google");
      console.error(err);
    },
  });

  return { googleSignIn, isLoading };
}
