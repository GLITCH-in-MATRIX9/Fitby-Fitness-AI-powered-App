import React from "react";
import { FaBullseye, FaChartLine, FaHistory, FaPen, FaListAlt, FaClipboardList } from "react-icons/fa";

const HomeFeatures = () => {
  const features = [
    {
      title: "Track Fitness Goals",
      icon: <FaBullseye className="text-3xl text-[#ed6126]" />,
      description: "Set and monitor your personalized fitness goals."
    },
    {
      title: "Write Blogs",
      icon: <FaPen className="text-3xl text-[#ed6126]" />,
      description: "Share your fitness journey, tips, and experiences with others."
    },
    {
      title: "Track Fitness History",
      icon: <FaHistory className="text-3xl text-[#ed6126]" />,
      description: "Review your past workouts and progress over time."
    },
    {
      title: "Add Daily Goals",
      icon: <FaListAlt className="text-3xl text-[#ed6126]" />,
      description: "Keep yourself on track by setting daily fitness objectives."
    },
    {
      title: "Progress Chart",
      icon: <FaChartLine className="text-3xl text-[#ed6126]" />,
      description: "Visualize your fitness improvements with dynamic charts."
    },
    {
      title: "Progress Log",
      icon: <FaClipboardList className="text-3xl text-[#ed6126]" />,
      description: "Maintain a detailed log of your achievements and challenges."
    }
  ];

  return (
    <section className="bg-white py-12 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        What You Can Do With FitBy
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeFeatures;
