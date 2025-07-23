/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./calendarDark.css";
import { useCreateBooking } from "./useBooking";
import { useUser } from "../authentication/useUser";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Example: service charge is 10% of item price
const SERVICE_CHARGE_RATE = 0.1;

export default function Booking({ item }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      quantity: 1,
    },
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);
  const { user } = useUser();
  const { mutate: createBooking, isLoading } = useCreateBooking();
  const navigate = useNavigate();

  // Watch the quantity field to update calculations in real-time
  // const quantity = watch("quantity") || 1;

  // Fetch existing bookings for this item to disable booked dates
  useEffect(() => {
    async function fetchBookedDates() {
      if (!item?.id) return;

      try {
        setIsLoadingDates(true);
        const { data, error } = await supabase
          .from("bookings")
          .select("start_date, end_date, status")
          .eq("item_id", item.id)
          .in("status", ["pending", "confirmed", "active"]);

        if (error) throw error;

        // Create an array of all booked dates
        const bookedDateRanges = [];
        data.forEach((booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);

          // Add each date in the range to the booked dates array
          const currentDate = new Date(start);
          while (currentDate <= end) {
            bookedDateRanges.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setBookedDates(bookedDateRanges);
      } catch (err) {
        console.error("Error fetching booked dates:", err);
      } finally {
        setIsLoadingDates(false);
      }
    }

    fetchBookedDates();
  }, [item?.id]);

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

    // Get quantity from form data
    const formData = watch();
    const qty = parseInt(formData.quantity) || 1;

    // Calculate rental duration in days
    const startDay = new Date(startDate);
    const endDay = new Date(endDate);
    const days = Math.max(
      1,
      Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24))
    );

    // Calculate costs with quantity
    const basePrice = item.price * qty * days;
    const serviceCharge = Math.round(basePrice * SERVICE_CHARGE_RATE);
    const total_price = basePrice + serviceCharge;

    createBooking(
      {
        item_id: item.id,
        renter_id: user.id,
        owner_id: item.owner_id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        quantity: qty,
        total_price,
        status: "pending",
      },
      {
        onSuccess: (data) => {
          toast.success(
            `Booking successful! Redirecting to confirmation page...`
          );
          // Navigate to the success page with booking details
          // Get form data
          const formData = watch();
          const qty = parseInt(formData.quantity) || 1;

          // Calculate rental duration in days
          const startDay = new Date(startDate);
          const endDay = new Date(endDate);
          const days = Math.max(
            1,
            Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24))
          );

          navigate("/booking-success", {
            state: {
              booking: {
                ...data,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                quantity: qty,
                days: days,
                item_price: item.price,
                total_price,
                item_name: item.name,
              },
            },
          });
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
    <div>
      <h3 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center">
        Book this item
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar and Date Selection - Left Side */}
          <div className="lg:w-7/12 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <label className="block mb-3 font-medium text-gray-200 text-base">
                  Start Date
                </label>
                <div className="flex justify-center">
                  <Calendar
                    date={startDate}
                    onChange={setStartDate}
                    color="#4f46e5"
                    className="rounded-lg shadow-lg calendar-dark w-full"
                    showDateDisplay={false}
                    minDate={new Date()}
                    disabledDates={bookedDates}
                  />
                </div>
                {isLoadingDates && (
                  <p className="text-blue-400 text-sm text-center mt-2">
                    Loading availability...
                  </p>
                )}
              </div>
              <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                <label className="block mb-3 font-medium text-gray-200 text-base">
                  End Date
                </label>
                <div className="flex justify-center">
                  <Calendar
                    date={endDate}
                    onChange={setEndDate}
                    color="#8b5cf6"
                    className="rounded-lg shadow-lg calendar-dark w-full"
                    minDate={startDate}
                    showDateDisplay={false}
                    disabledDates={bookedDates}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
              <label className="block mb-3 font-medium text-gray-200 text-base">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                defaultValue={1}
                {...register("quantity", { required: true, min: 1 })}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              />
              {errors.quantity && (
                <span className="text-red-400 text-sm block mt-1">
                  Quantity is required
                </span>
              )}
            </div>
          </div>

          {/* Order Summary and Booking - Right Side */}
          <div className="lg:w-5/12">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-24">
              <h4 className="font-bold text-xl text-white mb-6 border-b border-gray-700 pb-4">
                Order Summary
              </h4>

              <div className="space-y-5">
                {/* Calculate values based on quantity and duration */}
                {(() => {
                  const qty = parseInt(watch("quantity")) || 1;
                  const startDay = new Date(startDate);
                  const endDay = new Date(endDate);
                  const days = Math.max(
                    1,
                    Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24))
                  );
                  const basePrice = item.price * qty * days;
                  const serviceCharge = Math.round(
                    basePrice * SERVICE_CHARGE_RATE
                  );
                  const total = basePrice + serviceCharge;

                  return (
                    <>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-400">Item Price:</span>
                        <span className="font-semibold text-white">
                          ₦{item.price.toLocaleString()} × {qty}{" "}
                          {qty > 1 ? "items" : "item"}
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-400">Duration:</span>
                        <span className="font-semibold text-white">
                          {days} {days > 1 ? "days" : "day"}
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="font-semibold text-white">
                          ₦{basePrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-gray-400">
                          Service Charge (10%):
                        </span>
                        <span className="font-semibold text-blue-300">
                          ₦{serviceCharge.toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-700 my-2 pt-4 flex justify-between font-bold text-xl">
                        <span className="text-gray-300">Total:</span>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                          ₦{total.toLocaleString()}
                        </span>
                      </div>
                    </>
                  );
                })()}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-70 shadow-lg"
                  >
                    {isLoading ? "Processing..." : "Book Now"}
                  </button>

                  {!user && (
                    <p className="text-red-400 text-center text-sm mt-3">
                      You must be signed in to book this item
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
