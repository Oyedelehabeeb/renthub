/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useCreateBooking } from "./useBooking";
import { useUser } from "../authentication/useUser";

// Example: service charge is 10% of item price
const SERVICE_CHARGE_RATE = 0.1;

export default function Booking({ item }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { user } = useUser();
  const { mutate: createBooking, isLoading } = useCreateBooking();
  console.log(user);

  if (!item) return null;

  const onSubmit = () => {
    if (!user) {
      toast.error("You must be signed in to book an item.");
      return;
    }
    // UUID validation for user.id only
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(String(user.id))) {
      toast.error("Invalid user ID (not a UUID)");
      return;
    }

    // Check if user is trying to book their own item
    if (user.id === item.owner_id) {
      toast.error("You cannot book your own item!");
      return;
    }
    const serviceCharge = Math.round(item.price * SERVICE_CHARGE_RATE);
    const total_price = item.price + serviceCharge;
    createBooking(
      {
        item_id: item.id,
        renter_id: user.id,
        owner_id: item.owner_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        total_price,
        status: "pending",
      },
      {
        onSuccess: () => {
          toast.success(`Booking successful! Total: ₦${total_price}`);
        },
        onError: (err) => {
          toast.error(
            "Booking failed: " + (err.message || "Please try again.")
          );
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto p-8 rounded-none shadow-none">
          <h2 className="text-3xl font-bold mb-6 text-purple-800 text-center">
            Book this item
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  Start Date
                </label>
                <Calendar
                  date={startDate}
                  onChange={setStartDate}
                  color="#7c3aed"
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-lg">
                  End Date
                </label>
                <Calendar
                  date={endDate}
                  onChange={setEndDate}
                  color="#2563eb"
                  className="rounded-xl shadow-lg"
                  minDate={startDate}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700 text-lg">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                defaultValue={1}
                {...register("quantity", { required: true, min: 1 })}
                className="border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-300 text-lg"
              />
              {errors.quantity && (
                <span className="text-red-500 text-base">
                  Quantity is required
                </span>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 mt-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Item Price:</span>
                <span className="font-semibold text-gray-900">
                  ₦{item.price}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Service Charge (10%):</span>
                <span className="font-semibold text-blue-700">
                  ₦{Math.round(item.price * SERVICE_CHARGE_RATE)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-2xl">
                <span>Total:</span>
                <span className="text-purple-700">
                  ₦{item.price + Math.round(item.price * SERVICE_CHARGE_RATE)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:scale-[1.02] transition"
            >
              {isLoading ? "Booking..." : "Book now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
