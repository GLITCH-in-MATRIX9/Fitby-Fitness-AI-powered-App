import React from "react";
import comingsoon from "../../assets/comingsoon.png"

const FitnessChallenges = () => {
  return (
    <div className="p-6 max-w-[1280px] mx-auto text-center">
      <img
        src={comingsoon} 
        alt="Coming Soon"
        className="mx-auto w-64 h-auto"
      />
      <h2 className="text-2xl font-bold text-gray-700 mt-4">
        🚀 Coming Soon
      </h2>
      <p className="text-gray-500 mt-2">
        Exciting new fitness challenges are on their way. Stay tuned!
      </p>
    </div>
  );
};

export default FitnessChallenges;
