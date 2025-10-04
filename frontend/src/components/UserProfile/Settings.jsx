import React from "react";
import {
  FaUserEdit,
  FaLock,
  FaTrashAlt,
  FaCogs,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/users/delete", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to delete account");

        alert("Account deleted successfully");
        localStorage.removeItem("token");
        navigate("/register");
      } catch (err) {
        alert("Error deleting account");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 text-[#ed6126] mb-4">
        <FaCogs />
        <h2 className="text-2xl font-bold">Account Settings</h2>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow p-5 space-y-3 border">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Profile Settings
        </h3>
        <SettingItem
          icon={FaUserEdit}
          label="Edit Profile Info"
          onClick={handleEditProfile}
        />
        <SettingItem
          icon={FaLock}
          label="Change Password"
          onClick={handleChangePassword}
        />
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow p-5 space-y-3 border border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-3">
          Danger Zone
        </h3>

        <SettingItem
          icon={FaTrashAlt}
          label="Delete Account"
          danger
          onClick={handleDeleteAccount}
        />
      </div>
    </div>
  );
};

const SettingItem = ({ icon: Icon, label, onClick, danger = false }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 rounded hover:bg-orange-50 cursor-pointer transition"
  >
    <div className="flex items-center gap-3">
      <Icon
        className={`text-xl ${danger ? "text-red-500" : "text-[#ed6126]"}`}
      />
      <span
        className={`text-sm ${danger ? "text-red-600" : "text-gray-800"}`}
      >
        {label}
      </span>
    </div>
    <span className="text-xs text-gray-400">›</span>
  </div>
);

export default Settings;
