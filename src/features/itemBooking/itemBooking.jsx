import { useParams } from "react-router-dom";
import { useBrowse } from "../browse/useBrowse";
import Booking from "../booking/booking";
import { Loader2 } from "lucide-react";

export default function ItemBooking() {
  const { id } = useParams();
  const { data: items, isLoading } = useBrowse();
  const item = items?.find((itm) => String(itm.id) === String(id));

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">Loading item details...</p>
        </div>
      </div>
    );

  if (!item)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center p-6 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400 text-xl">Item not found</p>
          <p className="text-gray-400 mt-2">
            The requested item does not exist or has been removed.
          </p>
        </div>
      </div>
    );

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-7xl mx-auto">
        {/* Item Details Section */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-800 mb-12">
          <div className="lg:w-1/2 w-full relative h-96 lg:h-auto">
            <img
              src={item.image_url}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end lg:hidden">
              <h1 className="text-3xl font-bold text-white p-6">{item.name}</h1>
            </div>
          </div>
          <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between bg-gradient-to-br from-gray-900 to-gray-950">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4 hidden lg:block">
                {item.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-block bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 px-4 py-1.5 rounded-full text-sm border border-blue-700/30">
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ₦{item.price}
                  </span>
                  <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
                    Per unit
                  </span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Section - Full Width */}
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 p-6 lg:p-8">
          <Booking item={item} />
        </div>
      </div>
    </div>
  );
}
