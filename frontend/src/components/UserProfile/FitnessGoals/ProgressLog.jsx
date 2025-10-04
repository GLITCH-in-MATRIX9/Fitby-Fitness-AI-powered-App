import React, { useState } from "react";
import { FaPlus, FaCalendarAlt, FaTachometerAlt, FaListUl } from "react-icons/fa";

const ProgressLog = () => {
  const [logs, setLogs] = useState([
    { date: "2025-07-01", value: 0 },
    { date: "2025-07-10", value: 2 },
  ]);

  const [newLog, setNewLog] = useState({ date: "", value: "" });

  const handleAddLog = (e) => {
    e.preventDefault();
    setLogs((prev) => [...prev, newLog]);
    setNewLog({ date: "", value: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-2 text-[#ed6126] mb-4">
        <FaListUl />
        <h4 className="text-lg font-semibold">Add Progress Log</h4>
      </div>

      {/* Form */}
      <form onSubmit={handleAddLog} className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative w-full md:w-1/3">
          <FaCalendarAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
            className="border px-9 py-2 rounded w-full"
            required
          />
        </div>

        <div className="relative w-full md:w-1/3">
          <FaTachometerAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            placeholder="Value (e.g. kg/km)"
            value={newLog.value}
            onChange={(e) => setNewLog({ ...newLog, value: Number(e.target.value) })}
            className="border px-9 py-2 rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#ed6126] text-white px-4 py-2 rounded hover:bg-black flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <FaPlus /> Add
        </button>
      </form>

      {/* Log List */}
      <ul className="text-sm text-gray-700 space-y-2">
        {logs.map((log, index) => (
          <li
            key={index}
            className="flex items-center gap-3 p-2 rounded border border-gray-200 hover:bg-orange-50"
          >
            <FaCalendarAlt className="text-[#ed6126]" />
            <span>{log.date}</span>
            <FaTachometerAlt className="text-[#ed6126]" />
            <span className="font-semibold">{log.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressLog;
