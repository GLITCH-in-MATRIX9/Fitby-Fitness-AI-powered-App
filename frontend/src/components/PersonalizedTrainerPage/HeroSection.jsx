import React from "react";
import heroBg from "../../assets/personalized-trainer-hero.png";
import { Star } from "lucide-react";

const HeroSection = () => {
  // Smooth scroll handler
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full rounded-xl overflow-hidden py-16 px-8 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="text-left text-[#20293b]">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
            Meet Your <span className="text-[#ec6124]">Perfect Coach</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed">
            Personalized workouts, nutrition guidance, and real-time progress
            tracking — designed to help you achieve your fitness goals faster
            and smarter.
          </p>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => handleScroll("PackageSection")}
              className="bg-[#ec6124] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              Get Your Coach
            </button>
            <button
              onClick={() => handleScroll("reviewsSection")}
              className="bg-white hover:bg-gray-100 text-[#ec6124] font-bold px-6 py-3 rounded-lg shadow-lg transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Social Proof Avatars */}
          <div className="flex items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/40?img=${i + 20}`}
                alt="user"
                className="w-10 h-10 rounded-full border-2 border-white -ml-2 first:ml-0"
              />
            ))}
            <p className="ml-3 font-medium">5,000+ people joined</p>
          </div>
        </div>

        {/* Right Content (Hero Image + Review Card overlay) */}
        <div className="relative">
          <img
            src={heroBg}
            alt="Personalized Coach"
            className="w-full max-w-md mx-auto rounded-2xl shadow-xl"
          />

          {/* Floating Review Card */}
          <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 w-64">
            <div className="flex items-center mb-2">
              <img
                src="https://i.pravatar.cc/100?img=45"
                alt="reviewer"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h4 className="font-semibold text-[#20293b]">Emily R.</h4>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[#20293b]">
              “My coach built me a routine I actually stick to. Already seeing
              progress in 3 weeks!”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
