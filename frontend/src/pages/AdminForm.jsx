import React, { useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineBarChart,
  AiOutlineEdit,
  AiOutlineSetting,
  AiOutlineFileText,
} from "react-icons/ai";

import AdminFormPanel from "../components/AdminPanel/AdminFormPanel";
import StatsPage from "../components/AdminPanel/StatsPage";
import ManageVideos from "../components/AdminPanel/ManageVideos";
import Settings from "../components/AdminPanel/SettingsPage";
import ManageBlogs from "../components/AdminPanel/ManageBlogs";

const AdminForm = () => {
  const [activePanel, setActivePanel] = useState("add");

  const renderPanel = () => {
    switch (activePanel) {
      case "add":
        return <AdminFormPanel />;
      case "stats":
        return <StatsPage />;
      case "manage":
        return <ManageVideos />;
      case "settings":
        return <Settings />;
      case "blogs":
        return <ManageBlogs />;
      default:
        return <AdminFormPanel />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="w-64 bg-[#111827] text-white p-6 fixed top-15 left-0 bottom-0">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-4 text-sm font-medium">
          <button
            onClick={() => setActivePanel("manage")}
            className={`flex items-center gap-2 hover:text-[#e9632e] ${
              activePanel === "manage" ? "text-[#e9632e]" : ""
            }`}
          >
            <AiOutlineEdit size={20} /> Manage Videos
          </button>
          <button
            onClick={() => setActivePanel("stats")}
            className={`flex items-center gap-2 hover:text-[#e9632e] ${
              activePanel === "stats" ? "text-[#e9632e]" : ""
            }`}
          >
            <AiOutlineBarChart size={20} /> View Stats
          </button>
          
          <button
            onClick={() => setActivePanel("settings")}
            className={`flex items-center gap-2 hover:text-[#e9632e] ${
              activePanel === "settings" ? "text-[#e9632e]" : ""
            }`}
          >
            <AiOutlineSetting size={20} /> Settings
          </button>
          <button
            onClick={() => setActivePanel("blogs")}
            className={`flex items-center gap-2 hover:text-[#e9632e] ${
              activePanel === "blogs" ? "text-[#e9632e]" : ""
            }`}
          >
            <AiOutlineFileText size={20} /> Manage Blogs
          </button>
        </nav>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen overflow-auto">
        {renderPanel()}
      </div>
    </div>
  );
};

export default AdminForm;
