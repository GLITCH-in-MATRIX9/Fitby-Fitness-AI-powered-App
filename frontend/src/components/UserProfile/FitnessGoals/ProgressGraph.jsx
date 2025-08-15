import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaChartLine } from "react-icons/fa";

const ProgressGraph = () => {
  const progressData = [
    { date: "2025-07-01", value: 0 },
    { date: "2025-07-05", value: 1 },
    { date: "2025-07-10", value: 2 },
    { date: "2025-07-14", value: 3 },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5">
      {/* Title with icon */}
      <div className="flex items-center gap-2 text-[#ed6126] mb-3">
        <FaChartLine />
        <h4 className="text-lg font-semibold">Progress Chart</h4>
      </div>

      {/* Chart */}
      <div className="w-full h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ed6126",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#ed6126", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ed6126"
              strokeWidth={2.5}
              dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressGraph;
