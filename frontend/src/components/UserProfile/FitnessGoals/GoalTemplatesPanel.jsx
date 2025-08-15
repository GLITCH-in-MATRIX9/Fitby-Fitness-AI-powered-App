import React from "react";
import {
  FaBolt,
  FaClipboardList,
  FaClock,
  FaChevronRight,
} from "react-icons/fa";

const templates = [
  {
    title: "Lose 5kg in 6 Weeks",
    type: "Weight Loss",
    target: 5,
    unit: "kg",
    duration: "6 weeks",
  },
  {
    title: "Run 10km",
    type: "Endurance",
    target: 10,
    unit: "km",
    duration: "8 weeks",
  },
  {
    title: "Workout 4 Days a Week",
    type: "Habit",
    target: 4,
    unit: "days/week",
    duration: "Ongoing",
  },
];

const GoalTemplatesPanel = () => {
  const handleSelect = (template) => {
    console.log("Selected Template:", template);
    // Later: Autofill modal or directly create goal
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-[#ed6126]">
        <FaClipboardList />
        <h4 className="text-lg font-semibold">Popular Goal Templates</h4>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templates.map((t, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition hover:border-[#ed6126]"
          >
            <div className="space-y-1">
              <h5 className="text-base font-semibold text-[#333] flex items-center gap-2">
                <FaBolt className="text-[#ed6126]" />
                {t.title}
              </h5>
              <p className="text-sm text-gray-600 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1">
                  <FaClipboardList className="text-gray-400" /> {t.type}
                </span>
                <span className="flex items-center gap-1">
                  <FaBolt className="text-gray-400" /> {t.target} {t.unit}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-gray-400" /> {t.duration}
                </span>
              </p>
            </div>

            <button
              onClick={() => handleSelect(t)}
              className="flex items-center gap-1 bg-[#ed6126] text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600"
            >
              Select <FaChevronRight className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalTemplatesPanel;
