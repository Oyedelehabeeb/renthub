import { Helmet } from "react-helmet-async";
import About from "../features/about/About.jsx";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | ServiceHub</title>
        <meta
          name="description"
          content="Learn about ServiceHub's mission, values, and the team behind our community-driven service marketplace."
        />
      </Helmet>

      <About />
    </>
  );
}
