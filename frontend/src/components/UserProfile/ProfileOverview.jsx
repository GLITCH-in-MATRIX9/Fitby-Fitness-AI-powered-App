// src/pages/ProfileOverview.js
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ProfileStats from "../UserProfile/ProfileStats";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaMapMarkerAlt, FaWeight, FaBirthdayCake,
  FaVenusMars, FaRulerVertical, FaPercentage, FaBullseye, FaRunning,
  FaAllergies, FaPhoneAlt, FaAppleAlt, FaCapsules, FaClock, FaCheck, FaEdit,
  FaDumbbell
} from "react-icons/fa";

const getFitnessRank = (points) => {
  if (points >= 1000) return "Beast";
  if (points >= 600) return "Warrior";
  if (points >= 300) return "Fighter";
  return "Beginner";
};

const ProfileOverview = () => {
  const { token, user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [editField, setEditField] = useState(null);
  const [fieldValues, setFieldValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [pendingImage, setPendingImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  // Fetch profile, workouts, and points
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setFieldValues(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    const fetchWorkouts = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch workouts");
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Error fetching workouts:", err);
      }
    };

    const fetchPoints = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/workouts/points", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch points");
        const data = await res.json();
        setPoints(data.totalPoints || 0);
      } catch (err) {
        console.error("Error fetching points:", err);
      }
    };

    fetchProfile();
    fetchWorkouts();
    fetchPoints();
  }, [token]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      let ranked = [];
      if (Array.isArray(data) && data.length > 0) {
        ranked = data
          .sort((a, b) => b.points - a.points)
          .map((user, index) => ({
            ...user,
            rank: index + 1,
            image: user.image
              ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${user.image}`
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }));
      }
      if (profile && !ranked.find((u) => u._id === profile._id)) {
        ranked.push({
          ...profile,
          name: profile.name || "You",
          rank: "—",
          image: profile.image
            ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${profile.image}`
            : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
      }
      setLeaderboard(ranked);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      if (profile) {
        setLeaderboard([{
          ...profile,
          name: profile.name || "You",
          rank: "—",
          image: profile.image
            ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${profile.image}`
            : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        }]);
      }
    }
  };

  useEffect(() => {
    if (profile && token) {
      fetchLeaderboard();
    }
  }, [profile, token]);

  const handleChange = (field, value) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: fieldValues[field] }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProfile(updated);
      setFieldValues(updated);
      setEditField(null);
    } catch (err) {
      alert("Failed to save changes.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file || !token) return;
    const formData = new FormData();
    formData.append("image", file);
    setSaving(true);
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/upload-profile-image", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload image");
      const updated = await res.json();
      setProfile(updated);
      setFieldValues(updated);
      updateUser(updated);
      setPreviewUrl(null);
    } catch (err) {
      alert("Image upload failed.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <p className="p-4 text-red-500">Unable to load profile.</p>;
  }

  const Field = ({ label, icon: Icon, field, type = "text", placeholder }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3 text-gray-700 flex-wrap">
        <Icon className="text-[#ed6126]" />
        <span className="font-medium">{label}:</span>
        {editField === field ? (
          field === "gender" ? (
            <select
              value={fieldValues[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="border px-2 py-1 rounded max-w-xs"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              type={type}
              placeholder={placeholder}
              name={field}
              autoFocus
              className="border px-2 py-1 rounded max-w-xs"
              value={fieldValues[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          )
        ) : (
          <span>
            {field === "dob" && profile[field]
              ? new Date(profile[field]).toLocaleDateString()
              : profile[field] || "—"}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => (editField === field ? handleSave(field) : setEditField(field))}
        className="text-[#ed6126] hover:text-black"
        disabled={saving}
      >
        {editField === field ? <FaCheck /> : <FaEdit />}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 bg-white shadow rounded-md max-w-6xl mx-auto">
      {/* Left: Profile Stats + Leaderboard */}
      <div className="w-full lg:w-1/3 space-y-6">
        <ProfileStats
          name={profile.name}
          streak={profile.streak || 0}
          points={points}
          profileImage={
            previewUrl
              ? previewUrl
              : profile.image
                ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${profile.image}`
                : null
          }
          onImageUpload={(file) => {
            setPendingImage(file);
            setPreviewUrl(URL.createObjectURL(file));
          }}
        />

        {pendingImage && (
          <div className="mt-3 flex flex-col items-center gap-2">
            <button
              className="bg-[#ed6126] text-white px-4 py-2 rounded hover:bg-[#d6521f]"
              onClick={() => {
                handleImageUpload(pendingImage);
                setPendingImage(null);
                setPreviewUrl(null);
              }}
              disabled={saving}
            >
              Save Photo
            </button>
            <button
              className="text-sm text-gray-600 underline"
              onClick={() => {
                setPendingImage(null);
                setPreviewUrl(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">🏆 Leaderboard</h3>
          {leaderboard.slice(0, 3).map((user, index) => (
            <div
              key={index}
              className="bg-[#fff4e8] p-3 rounded-md shadow flex items-center justify-between border border-[#ffcfae]"
            >
              <div className="flex items-center gap-3">
                <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
                <div>
                  <div className="text-gray-800 font-medium truncate">{user.name}</div>
                  <div className="text-xs text-gray-500">{getFitnessRank(user.points)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#ed6126] font-bold text-sm">#{user.rank}</div>
                <div className="text-gray-700 text-sm">{user.points} pts</div>
              </div>
            </div>
          ))}
          {leaderboard.length > 3 && (
            <button
              className="text-[#ed6126] hover:text-[#d6521f] font-semibold mt-2"
              onClick={() => navigate("/leaderboard")}
            >
              View All
            </button>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaDumbbell className="text-[#ed6126]" /> Recent Workouts
          </h3>
          {workouts.length > 0 ? (
            workouts.slice(0, 3).map((w, idx) => (
              <div key={idx} className="bg-[#fff4e8] p-3 rounded-md shadow border border-[#ffcfae]">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{w.workout}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {w.duration} min | {w.calories} kcal | {w.points} pts
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No workouts recorded.</p>
          )}
        </div>
      </div>

      {/* Right: Profile Form */}
      <div className="w-full lg:w-2/3 space-y-8">
        <div className="bg-[#fff6ed] p-4 sm:p-6 rounded-lg shadow border border-[#dea66d]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center sm:text-left">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Field label="Name" field="name" icon={FaUser} />
            <Field label="Email" field="email" icon={FaEnvelope} type="email" />
            <Field label="Location" field="location" icon={FaMapMarkerAlt} />
            <Field label="Date of Birth" field="dob" icon={FaBirthdayCake} type="date" />
            <Field label="Gender" field="gender" icon={FaVenusMars} />
            <Field label="Weight (kg)" field="weight" icon={FaWeight} type="number" />
            <Field label="Height (cm)" field="height" icon={FaRulerVertical} type="number" />
            <Field label="Body Fat (%)" field="bodyFat" icon={FaPercentage} type="number" />
            <Field label="Fitness Goals" field="fitnessGoals" icon={FaBullseye} />
            <Field label="Activity Level" field="activityLevel" icon={FaRunning} />
            <Field label="Allergies / Conditions" field="allergies" icon={FaAllergies} />
            <Field label="Emergency Contact" field="emergencyContact" icon={FaPhoneAlt} />
            <Field label="Nutrition Preferences" field="nutrition" icon={FaAppleAlt} />
            <Field label="Supplements" field="supplements" icon={FaCapsules} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <FaClock className="text-[#ed6126]" />
              <span>
                Last Updated: {profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : "—"}
              </span>
            </div>
            <button
              className="bg-[#ed6126] text-white px-5 py-2 rounded-lg hover:bg-[#d6521f] w-full sm:w-auto"
              onClick={() => Object.keys(fieldValues).forEach((field) => handleSave(field))}
              disabled={saving}
            >
              Save All
            </button>
          </div>
        </div>

      </div>
    </div>

  );
};

export default ProfileOverview;
