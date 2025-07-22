import ItemBooking from "../features/itemBooking/itemBooking";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useBrowse } from "../features/browse/useBrowse";

export default function ItemPage() {
  const { id } = useParams();
  const { data: items } = useBrowse();
  const item = items?.find((itm) => String(itm.id) === String(id));

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>
          {item ? `${item.name} | RentHub` : "Item Details | RentHub"}
        </title>
        <meta
          name="description"
          content={
            item
              ? `Rent ${item.name} on RentHub - ${item.description?.substring(
                  0,
                  160
                )}`
              : "View item details and make a booking on RentHub"
          }
        />
      </Helmet>
      <div className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Item Details
          </span>
        </h2>
      </div>
      <ItemBooking />
    </div>
  );
}
