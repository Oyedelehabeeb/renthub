import { Star } from "lucide-react";
import HeroGeometric from "../../components/HeroGeometric";
import { Link } from "react-router-dom";

// Mock data for featured services
const featuredItems = [
  {
    id: 1,
    name: "Professional Catering Service",
    category: "Catering",
    price: 25000,
    rating: 4.8,
    reviews: 124,
    image_url: "https://images.unsplash.com/photo-1555244162-803834f70033",
    provider: "Elite Catering Co.",
  },
  {
    id: 2,
    name: "Wedding Photography Package",
    category: "Photography",
    price: 120000,
    rating: 4.9,
    reviews: 89,
    image_url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b",
    provider: "Moments Captured",
  },
  {
    id: 3,
    name: "Home Cleaning Service",
    category: "Cleaning",
    price: 8000,
    rating: 4.7,
    reviews: 215,
    image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    provider: "Sparkle Clean",
  },
  {
    id: 4,
    name: "Professional DJ Services",
    category: "Entertainment",
    price: 35000,
    rating: 4.8,
    reviews: 76,
    image_url: "https://images.unsplash.com/photo-1571266752333-31a55580a50e",
    provider: "Rhythm Masters",
  },
];

// Mock data for testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Event Planner",
    content:
      "This platform has transformed how I organize events. Finding quality service providers is now seamless and stress-free!",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Small Business Owner",
    content:
      "I've grown my client base exponentially since listing my services here. The platform is intuitive and the support team is fantastic.",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    id: 3,
    name: "Aisha Patel",
    role: "Wedding Coordinator",
    content:
      "The variety and quality of services available here is outstanding. My clients are always impressed with the vendors I find through this platform.",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
  },
];

export default function Home() {
  return (
    <>
      <main className="bg-black min-h-screen">
        {/* Hero Section */}
        <HeroGeometric />

        {/* Services Categories */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Popular Service Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Category 1 */}
              <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d"
                  alt="Event Planning"
                  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">
                    Event Planning
                  </h3>
                </div>
              </div>

              {/* Category 2 */}
              <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce"
                  alt="Photography"
                  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">
                    Photography
                  </h3>
                </div>
              </div>

              {/* Category 3 */}
              <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
                  alt="Catering"
                  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">Catering</h3>
                </div>
              </div>

              {/* Category 4 */}
              <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1526948531399-320e7e40f0ca"
                  alt="Home Services"
                  className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-white font-semibold text-lg">
                    Home Services
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            {/* Featured Items */}
            <div className="mb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Featured Services
                </h2>
                <Link to="/browse" className="text-blue-400 mt-4 md:mt-0">
                  View all services →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredItems.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px]"
                  >
                    <Link to={`/service/${service.id}`}>
                      <div className="relative h-48">
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="flex items-center">
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs">
                            {service.category}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white text-lg font-semibold">
                          {service.name}
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        By {service.provider}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">
                          ₦{service.price.toLocaleString()}
                        </span>
                        <div className="flex items-center">
                          <Star
                            className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500"
                            aria-hidden="true"
                          />
                          <span className="text-gray-400 text-sm">
                            {service.rating} ({service.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">
              What Our Users Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl relative"
                >
                  <div className="absolute top-0 left-10 transform -translate-y-1/2">
                    <div className="rounded-full border-4 border-gray-900 overflow-hidden h-16 w-16">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="pt-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <p className="text-white font-medium">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 mb-10 text-lg">
                Join thousands of satisfied users who are already using our
                platform to find services or grow their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/browse">
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                    Browse Services
                  </button>
                </Link>
                <Link to="/list-service">
                  <button className="px-8 py-3 border border-purple-500/50 hover:bg-purple-500/10 text-purple-400 font-medium rounded-xl transition-colors">
                    List Your Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
