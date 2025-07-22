import { Link } from "react-router-dom";
import { useLogin } from "./useLogin";
import { useGoogleAuth } from "./useGoogleAuth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();
  const { googleSignIn, isLoading: isGoogleLoading } = useGoogleAuth();

  function handleSubmit(e) {
    e.preventDefault();
    login(
      { email, password },
      {
        onSettled: () => {
          setEmail("");
          setPassword("");
        },
      }
    );
  }

  function handleGoogleSignin() {
    googleSignIn();
    // Toast is already handled in the useGoogleAuth hook
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Sign in to RentHub
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-700" />
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700" />
        </div>
        <button
          onClick={handleGoogleSignin}
          disabled={isLoading || isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-gray-700 rounded-lg bg-gray-800/50 hover:bg-gray-800 shadow-sm font-medium text-gray-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </>
          )}
        </button>
        <div className="mt-6 text-center text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
