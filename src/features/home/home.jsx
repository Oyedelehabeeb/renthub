import { Star } from "lucide-react";
import HeroGeometric from "../../components/HeroGeometric";
import { Link } from "react-router-dom";

// Mock data for featured items
const featuredItems = [
  {
    id: 1,
    name: "Professional Catering Service",
    category: "Catering",
    price: 25000,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description:
      "Full-service catering for events of all sizes. Includes setup, service, and cleanup.",
  },
  {
    id: 2,
    name: "DSLR Camera Kit",
    category: "Photography",
    price: 5000,
    rating: 4.8,
    image_url:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description:
      "Professional camera with lenses, tripod, and lighting equipment.",
  },
  {
    id: 3,
    name: "Event Decoration Package",
    category: "Event Planning",
    price: 15000,
    rating: 4.7,
    image_url:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description:
      "Complete decoration setup for weddings, parties, and corporate events.",
  },
  {
    id: 4,
    name: "DJ Equipment Set",
    category: "Entertainment",
    price: 12000,
    rating: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1571266028243-8036dea3977a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    description:
      "Professional DJ setup with speakers, mixer, and lighting effects.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroGeometric />

      {/* Categories Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-400">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Catering", icon: "🍽️" },
              { name: "Photography", icon: "📷" },
              { name: "Event Planning", icon: "🎪" },
              { name: "Entertainment", icon: "🎵" },
              { name: "Transportation", icon: "🚗" },
              { name: "Equipment", icon: "🔧" },
              { name: "Venues", icon: "🏢" },
              { name: "Furniture", icon: "🪑" },
              { name: "Electronics", icon: "📱" },
              { name: "Fashion", icon: "👔" },
              { name: "Sports", icon: "⚽" },
              { name: "Tools", icon: "🔨" },
            ].map((category, index) => (
              <Link to={`/browse?category=${category.name}`} key={index}>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center hover:bg-gradient-to-br hover:from-blue-900/40 hover:to-purple-900/40 hover:border-blue-700/50 transition-all duration-300">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-gray-200 font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Items</h2>
              <p className="text-gray-400">Popular rentals in your area</p>
            </div>
            <Link to="/browse" className="mt-4 md:mt-0">
              <button className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg bg-transparent hover:bg-gray-800 transition font-medium">
                View All
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <Link to={`/item/${item.id}`} key={item.id}>
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-sm backdrop-blur-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-20" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-white line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="text-sm bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 px-2 py-0.5 rounded-full border border-blue-700/30">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ₦{item.price.toLocaleString()}
                      </span>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 border border-gray-700">
                        Per event
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-400">
              Trusted by thousands of renters and providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Event Planner",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
                quote:
                  "RentHub has transformed how I organize events. Access to quality equipment without the long-term commitment is a game-changer!",
              },
              {
                name: "Michael Chen",
                role: "Photographer",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
                quote:
                  "As a freelance photographer, RentHub lets me access high-end equipment when I need it. My business has grown significantly since I started using the platform.",
              },
              {
                name: "Amara Wilson",
                role: "Catering Business Owner",
                image:
                  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80",
                quote:
                  "I rent out my catering equipment during off-peak times and have created a new revenue stream. The platform is intuitive and secure.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-gray-300 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Renting?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust RentHub for their rental needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                Browse Items
              </button>
            </Link>
            <Link to="/list-item">
              <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl bg-transparent hover:bg-gray-800 transition font-medium">
                List Your Items
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
