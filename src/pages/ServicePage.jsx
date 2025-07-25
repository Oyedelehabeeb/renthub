import ServiceBooking from "../features/serviceBooking/serviceBooking";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useBrowse } from "../features/browse/useBrowse";

export default function ServicePage() {
  const { id } = useParams();
  const { data: services } = useBrowse();
  const service = services?.find((srv) => String(srv.id) === String(id));

  return (
    <div className="bg-black text-white min-h-screen">
      <Helmet>
        <title>
          {service
            ? `${service.name} | ServiceHub`
            : "Service Details | ServiceHub"}
        </title>
        <meta
          name="description"
          content={
            service
              ? `Book ${
                  service.name
                } on ServiceHub - ${service.description?.substring(0, 160)}`
              : "View service details and make a booking on ServiceHub"
          }
        />
      </Helmet>
      <div className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center sm:text-left">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Service Details
          </span>
        </h2>
      </div>
      <ServiceBooking />
    </div>
  );
}
