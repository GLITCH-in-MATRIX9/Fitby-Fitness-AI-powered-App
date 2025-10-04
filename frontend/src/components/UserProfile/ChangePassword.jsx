import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      if (!res.ok) throw new Error("Failed to change password");

      alert("Password changed successfully");
      navigate("/settings");
    } catch (err) {
      alert("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-[#ed6126] mb-4">Change Password</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow space-y-4 border"
      >
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#ed6126] text-white px-4 py-2 rounded hover:bg-[#d3551f]"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
