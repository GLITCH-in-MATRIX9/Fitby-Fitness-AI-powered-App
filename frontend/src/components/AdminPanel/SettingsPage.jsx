// src/pages/Settings.jsx
import React, { useState } from "react";
import { AiOutlineUser, AiOutlineLock, AiOutlineSetting } from "react-icons/ai";
import { MdOutlineDarkMode } from "react-icons/md";

const SettingsPage = () => {
  const [form, setForm] = useState({
    name: "Admin",
    email: "admin@example.com",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Add logic for saving settings
    console.log("Saving settings:", form);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <AiOutlineSetting size={28} className="text-[#e9632e]" />
        <h2 className="text-3xl font-bold text-[#e9632e]">Settings</h2>
      </div>

      {/* Account Settings */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AiOutlineUser className="text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-800">Profile</h3>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-[#e9632e] hover:bg-black text-white px-6 py-2 rounded-lg font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Settings */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="flex items-center gap-2 mb-4">
          <AiOutlineLock className="text-gray-700" />
          <h3 className="text-xl font-semibold text-gray-800">Update Password</h3>
        </div>
        <form className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-[#e9632e] hover:bg-black text-white px-6 py-2 rounded-lg font-medium"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
};

export default SettingsPage;
