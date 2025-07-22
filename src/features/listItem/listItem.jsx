import { useForm } from "react-hook-form";
import { useState } from "react";
import { addItem } from "../../services/apiList";
import { useUser } from "../authentication/useUser";
import { Loader2 } from "lucide-react";

export default function ListItem() {
  const { user } = useUser();
  const owner_id = user?.id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(data) {
    setError("");
    setSuccess("");
    try {
      await addItem({ ...data, owner_id });
      setSuccess("Item listed successfully!");
      reset();
    } catch (err) {
      if (
        err.message &&
        err.message.includes("violates foreign key constraint")
      ) {
        setError(
          "Your profile does not exist. Please contact support or try signing out and signing in again."
        );
      } else {
        setError(err.message || "Failed to list item.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          List a New Item
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-3 bg-gray-800/70 border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Item name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className={`w-full px-4 py-3 bg-gray-800/70 border ${
                errors.description ? "border-red-500" : "border-gray-700"
              } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Describe your item"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Price (per day)
              </label>
              <input
                type="number"
                id="price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be at least 0" },
                })}
                className={`w-full px-4 py-3 bg-gray-800/70 border ${
                  errors.price ? "border-red-500" : "border-gray-700"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="₦"
                min="0"
                step="0.01"
              />
              {errors.price && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                {...register("category", { required: "Category is required" })}
                className={`w-full px-4 py-3 bg-gray-800/70 border ${
                  errors.category ? "border-red-500" : "border-gray-700"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="e.g. Electronics"
              />
              {errors.category && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Listing...
              </>
            ) : (
              "List Item"
            )}
          </button>
        </form>
        {success && (
          <div className="mt-6 text-green-400 text-center font-medium bg-green-400/10 py-3 px-4 rounded-lg border border-green-500/30">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-6 text-red-400 text-center font-medium bg-red-400/10 py-3 px-4 rounded-lg border border-red-500/30">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
