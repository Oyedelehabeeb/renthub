import { useBrowse } from "./useBrowse";
import { Link } from "react-router-dom";
import { Loader2, Search, SlidersHorizontal, Tag } from "lucide-react";
import { useState } from "react";

export default function Browse() {
  const { data: services, isLoading } = useBrowse();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sample categories
  const categories = [
    "Photography",
    "Catering",
    "Event Planning",
    "Marketing",
    "Design",
    "Consulting",
  ];

  const filteredServices = services?.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? service.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl">Loading available services...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Browse Services
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find the perfect service to book for your next project or event.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="py-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 text-gray-300">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter:</span>
              </div>
              <select
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredServices.map((service) => (
                <Link
                  to={`/service/${service.id}`}
                  key={service.id}
                  className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-200 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
                      <Tag className="h-3 w-3 mr-1 text-blue-400" />
                      <span className="text-xs text-blue-100">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h2>
                      <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-lg">
                        ₦{service.price}/day
                      </span>
                      <button className="bg-gray-800 hover:bg-blue-900/40 px-3 py-1 rounded-md text-sm text-gray-300 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400 mb-4">
                No services match your search
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
