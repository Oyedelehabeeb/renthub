import { Helmet } from "react-helmet-async";
import About from "../features/about/About";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | RentHub</title>
        <meta
          name="description"
          content="Learn about RentHub's mission, values, and the team behind our community-driven rental marketplace."
        />
      </Helmet>

      <About />
    </>
  );
}
