import { Helmet } from "react-helmet-async";
import Browse from "../features/browse/browse";

export default function BrowsePage() {
  return (
    <>
      <Helmet>
        <title>Browse Services | ServiceHub</title>
        <meta
          name="description"
          content="Browse through our collection of services available for booking. Find photography, catering, event planning and more."
        />
      </Helmet>

      <Browse />
    </>
  );
}
