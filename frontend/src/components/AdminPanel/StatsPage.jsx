// src/pages/StatsPage.jsx
import React from "react";
import {
  AiOutlineVideoCamera,
  AiOutlineUser,
  AiOutlineLineChart,
} from "react-icons/ai";
import { BsClockHistory } from "react-icons/bs";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const StatsPage = () => {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <AiOutlineLineChart size={28} className="text-[#e9632e]" />
        <h2 className="text-3xl font-bold text-[#e9632e]">Dashboard Overview</h2>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <AiOutlineVideoCamera size={36} className="text-[#e9632e]" />
          <div>
            <p className="text-gray-500 text-sm">Total Videos</p>
            <h3 className="text-2xl font-semibold">128</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <AiOutlineUser size={36} className="text-blue-500" />
          <div>
            <p className="text-gray-500 text-sm">Male Videos</p>
            <h3 className="text-2xl font-semibold">74</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <AiOutlineUser size={36} className="text-pink-400" />
          <div>
            <p className="text-gray-500 text-sm">Female Videos</p>
            <h3 className="text-2xl font-semibold">54</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <AiOutlineLineChart size={36} className="text-green-500" />
          <div>
            <p className="text-gray-500 text-sm">Trending Muscle</p>
            <h3 className="text-2xl font-semibold">Chest</h3>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <AiOutlineLineChart size={22} /> Weekly Uploads
          </h3>
          <span className="text-sm text-gray-500">June 2025</span>
        </div>
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 italic">
          (Chart Coming Soon – You can use <code> recharts</code> here)
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <BsClockHistory size={20} className="text-[#e9632e]" />
          <h3 className="text-lg font-semibold">Recent Upload Activity</h3>
        </div>
        <ul className="text-sm text-gray-600 space-y-3">
          <li className="flex items-center gap-2">
            <MdOutlineAddCircleOutline className="text-green-600" />
            Added <strong>"Dumbbell Shoulder Press"</strong> for male (2 hours ago)
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineAddCircleOutline className="text-green-600" />
            Added <strong>"Leg Raises"</strong> for female (yesterday)
          </li>
          <li className="flex items-center gap-2">
            <MdOutlineAddCircleOutline className="text-green-600" />
            Added <strong>"Barbell Squat"</strong> for male (2 days ago)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StatsPage;
