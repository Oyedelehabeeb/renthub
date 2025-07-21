import { Helmet } from "react-helmet-async";
import Browse from "../features/browse/browse";

export default function BrowsePage() {
  return (
    <>
      <Helmet>
        <title>Browse Items | RentHub</title>
        <meta
          name="description"
          content="Browse through our collection of items available for rent. Find tools, equipment, vehicles and more."
        />
      </Helmet>

      <Browse />
    </>
  );
}
