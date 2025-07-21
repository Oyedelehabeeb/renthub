import { Helmet } from "react-helmet-async";
import Contact from "../features/contact/contact";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | RentHub</title>
        <meta
          name="description"
          content="Get in touch with the RentHub team. We're here to help with any questions or issues you may have."
        />
      </Helmet>

      <Contact />
    </>
  );
}
