import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignup } from "./useSignup";
import { useGoogleAuth } from "./useGoogleAuth";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { signup, isLoading } = useSignup();
  const { googleSignIn, isLoading: isGoogleLoading } = useGoogleAuth();

  function onSubmit({ fullName, password, email }) {
    signup(
      { fullName, password, email },
      {
        onSettled: () => reset(),
      }
    );
  }
  
  function handleGoogleSignin() {
    googleSignIn();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Create your RentHub account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full px-4 py-3 bg-gray-800/70 border ${
                errors.fullName ? "border-red-500" : "border-gray-700"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your name"
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-red-400 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-3 bg-gray-800/70 border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-3 bg-gray-800/70 border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Create a password"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
