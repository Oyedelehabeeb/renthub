import { useParams } from "react-router-dom";
import Booking from "../features/booking/booking";
import { useBrowse } from "../features/browse/useBrowse";

export default function ItemPage() {
  const { id } = useParams();
  const { data: items, isLoading } = useBrowse();
  const item = items?.find((itm) => String(itm.id) === String(id));

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!item)
    return <div className="text-center py-20 text-red-500">Item not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <img
          src={item.image_url}
          alt={item.name}
          className="md:w-1/2 w-full h-80 object-cover"
        />
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {item.name}
            </h1>
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs mb-4">
              {item.category}
            </span>
            <p className="text-gray-700 mb-4">{item.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-purple-700">
                ₦{item.price}
              </span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                Per unit
              </span>
            </div>
          </div>
          <Booking item={item} />
        </div>
      </div>
    </div>
  );
}
