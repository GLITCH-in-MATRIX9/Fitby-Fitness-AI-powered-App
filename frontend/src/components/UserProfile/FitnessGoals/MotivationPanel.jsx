import React from "react";
import {
  FaQuoteLeft,
  FaMedal,
  FaLightbulb,
} from "react-icons/fa";

const MotivationPanel = () => {
  const quote =
    "Success doesn’t come from what you do occasionally. It comes from what you do consistently.";
  const badge = "🔥 3 Days Streak!";
  const tip =
    "Tip: Drink a full glass of water before each meal to support weight loss.";

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-3xl space-y-5">
      {/* Quote Section */}
      <div className="flex items-start gap-3">
        <FaQuoteLeft className="text-[#ed6126] mt-1" />
        <div>
          <h4 className="text-sm font-semibold text-[#ed6126] mb-1">
            Quote of the Day
          </h4>
          <p className="italic text-gray-700">“{quote}”</p>
        </div>
      </div>

      {/* Badge Section */}
      <div className="flex items-start gap-3">
        <FaMedal className="text-green-600 mt-1" />
        <div>
          <h4 className="text-sm font-semibold text-[#ed6126] mb-1">Current Streak</h4>
          <p className="text-green-600 font-semibold">{badge}</p>
        </div>
      </div>

      {/* Tip Section */}
      <div className="flex items-start gap-3">
        <FaLightbulb className="text-yellow-500 mt-1" />
        <div>
          <h4 className="text-sm font-semibold text-[#ed6126] mb-1">AI Fitness Tip</h4>
          <p className="text-gray-800">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default MotivationPanel;
