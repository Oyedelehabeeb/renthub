// import { useState } from "react";
import { useBrowse } from "./useBrowse";

export default function Browse() {
  // Placeholder for items, replace with fetched data later
  const { data: items, isLoading } = useBrowse();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Browse Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-blue-600 font-bold text-lg">
                    ${item.price}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
