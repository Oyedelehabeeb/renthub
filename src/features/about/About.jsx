import { Code, Leaf, ShieldCheck, Users } from "lucide-react";

export default function About() {
  const teamMembers = [
    {
      name: "Alex Morgan",
      role: "CEO & Founder",
      bio: "Alex founded RentHub with a vision to transform how people access and share resources.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "Sophia Chen",
      role: "Chief Product Officer",
      bio: "Sophia oversees product strategy and ensures RentHub delivers exceptional user experiences.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Marcus leads our engineering team and drives technical innovation at RentHub.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    },
    {
      name: "Jamie Rodriguez",
      role: "Head of Operations",
      bio: "Jamie ensures that RentHub runs smoothly, managing day-to-day operations and logistics.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    },
  ];

  const values = [
    {
      icon: <Users className="h-6 w-6 text-blue-400" />,
      name: "Community First",
      description:
        "We believe in the power of shared resources to build stronger communities and more sustainable lifestyles.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
      name: "Trust & Safety",
      description:
        "We prioritize creating a secure platform where users can rent with confidence and peace of mind.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-blue-400" />,
      name: "Sustainability",
      description:
        "By encouraging sharing over buying, we're committed to reducing waste and environmental impact.",
    },
    {
      icon: <Code className="h-6 w-6 text-blue-400" />,
      name: "Innovation",
      description:
        "We continuously evolve our platform with cutting-edge technology to improve the rental experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About RentHub
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming the way people access and share resources in a
              community-driven rental marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  RentHub began in 2022 with a simple observation: people have
                  items they rarely use, while others need those same items but
                  don&apos;t want to purchase them outright.
                </p>
                <p>
                  Our founder, Alex Morgan, experienced this firsthand when
                  moving to a new city and needing tools for a weekend project.
                  After borrowing from a neighbor, the idea for a
                  community-based rental platform was born.
                </p>
                <p>
                  What started as a small local platform has grown into a
                  nationwide marketplace connecting thousands of people who want
                  to rent rather than buy, fostering community connections and
                  promoting sustainable consumption.
                </p>
                <p>
                  Today, RentHub is revolutionizing access to goods by making
                  rental easy, secure, and beneficial for both owners and
                  renters across the country.
                </p>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  alt="Team collaboration"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re on a mission to create a more accessible, sustainable world
              through the power of shared resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-500/50 transition-colors"
              >
                <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.name}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind RentHub&apos;s mission to
              revolutionize rental marketplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-colors"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-blue-400 mb-2">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">10K+</p>
              <p className="text-xl text-gray-300">Active Users</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">50+</p>
              <p className="text-xl text-gray-300">Cities Covered</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">25K+</p>
              <p className="text-xl text-gray-300">Items Available</p>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-white mb-2">15K+</p>
              <p className="text-xl text-gray-300">Successful Rentals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Join the RentHub Community
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of the sharing economy revolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
              Sign Up Now
            </button>
            <button className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl bg-transparent hover:bg-gray-800 transition font-medium">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
