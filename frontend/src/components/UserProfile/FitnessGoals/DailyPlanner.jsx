import React, { useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const DailyPlanner = () => {
  const [schedule, setSchedule] = useState({
    Mon: false,
    Tue: true,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800">
          <FaCalendarAlt className="text-[#ed6126]" />
          <h4 className="text-lg font-semibold">Habit Tracker</h4>
        </div>
        <span className="text-sm text-gray-400">Toggle your workout days</span>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-7 gap-3 text-sm">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-200 border ${
              schedule[day]
                ? "bg-[#ed6126] text-white border-[#ed6126] shadow-md"
                : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {schedule[day] ? (
              <FaCheckCircle className="text-white" />
            ) : (
              <FaRegCircle className="text-gray-400" />
            )}
            <span className="font-medium">{day}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyPlanner;
