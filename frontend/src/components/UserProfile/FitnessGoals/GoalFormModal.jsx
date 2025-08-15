import React, { useState } from "react";
import {
  FaBullseye,
  FaFlagCheckered,
  FaBalanceScale,
  FaRulerCombined,
  FaCalendarDay,
  FaCalendarCheck,
  FaSave,
} from "react-icons/fa";

const GoalFormModal = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    target: "",
    unit: "",
    startDate: "",
    targetDate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted goal:", formData);
    // Future: Send to backend
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-5 w-full max-w-2xl"
    >
      <div className="flex items-center gap-2 mb-5 text-gray-800">
        <FaFlagCheckered className="text-[#ed6126]" />
        <h4 className="text-lg font-semibold">Add a New Goal</h4>
      </div>

      <div className="grid grid-cols-1 gap-4 text-sm">
        {/* Title */}
        <div className="flex items-center gap-3">
          <FaBullseye className="text-[#ed6126]" />
          <input
            type="text"
            placeholder="Goal Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
          />
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          <FaBalanceScale className="text-[#ed6126]" />
          <input
            type="text"
            placeholder="Goal Type (e.g., Weight Loss)"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
          />
        </div>

        {/* Target + Unit */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 w-1/2">
            <FaRulerCombined className="text-[#ed6126]" />
            <input
              type="number"
              placeholder="Target"
              value={formData.target}
              onChange={(e) => handleChange("target", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            />
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <FaBalanceScale className="text-[#ed6126]" />
            <input
              type="text"
              placeholder="Unit (kg, km)"
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 w-1/2">
            <FaCalendarDay className="text-[#ed6126]" />
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            />
          </div>
          <div className="flex items-center gap-2 w-1/2">
            <FaCalendarCheck className="text-[#ed6126]" />
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleChange("targetDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#ed6126]"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 flex items-center justify-center gap-2 bg-[#ed6126] text-white py-2 px-4 rounded hover:bg-black transition"
        >
          <FaSave />
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalFormModal;
