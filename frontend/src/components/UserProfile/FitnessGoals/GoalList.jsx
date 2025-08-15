import React from "react";
import {
  FaBullseye,
  FaTachometerAlt,
  FaFlagCheckered,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

const GoalList = () => {
  const dummyGoals = [
    {
      id: "1",
      title: "Lose Weight",
      type: "Weight Loss",
      target: 5,
      unit: "kg",
      progress: 2,
      startDate: "2025-07-01",
      targetDate: "2025-08-15",
    },
    {
      id: "2",
      title: "Run 10km",
      type: "Endurance",
      target: 10,
      unit: "km",
      progress: 3,
      startDate: "2025-07-10",
      targetDate: "2025-09-01",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {dummyGoals.map((goal) => {
        const percentage = Math.min(
          Math.round((goal.progress / goal.target) * 100),
          100
        );

        return (
          <div
            key={goal.id}
            className="bg-white shadow-md rounded-xl p-5 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center gap-2 text-[#ed6126]">
              <FaBullseye />
              <h4 className="text-lg font-semibold">{goal.title}</h4>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaChartLine className="text-gray-400" />
              <span>{goal.type}</span>
            </div>

            {/* Details */}
            <div className="text-sm text-gray-700 space-y-1">
              <div className="flex items-center gap-2">
                <FaFlagCheckered className="text-gray-400" />
                <span>
                  Target: <b>{goal.target} {goal.unit}</b>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaTachometerAlt className="text-gray-400" />
                <span>
                  Progress: <b>{goal.progress} {goal.unit}</b> ({percentage}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span>
                  {goal.startDate} → {goal.targetDate}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full rounded-full bg-[#ed6126] transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;
