import React, { useRef, useState, useEffect } from "react";
import { FaUser, FaFire, FaStar, FaUpload } from "react-icons/fa";

// Tier assignment based on points
const getFitnessRank = (points) => {
  if (points >= 1000) return "Beast";
  if (points >= 600) return "Warrior";
  if (points >= 300) return "Fighter";
  if (points >= 150) return "Beginner";
  return null;
};

const ProfileStats = ({ name, streak, points, profileImage, onImageUpload = () => {} }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    setPreview(profileImage);
  }, [profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview locally using FileReader
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Pass file to parent
    onImageUpload(file);
  };

  const rank = getFitnessRank(points);

  return (
    <div className="bg-orange-50 border border-orange-200 p-4 rounded-md mb-6 shadow-sm flex flex-col items-center gap-4">
      <div className="relative w-24 h-24">
        <img
          src={
            preview ||
            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
          }
          alt="Profile"
          className="object-cover w-24 h-24 rounded-full border-2 border-[#ed6126] shadow-md"
        />
        <button
          type="button"
          className="absolute bottom-0 right-0 bg-white border border-gray-300 p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => inputRef.current.click()}
        >
          <FaUpload className="text-[#ed6126] text-sm" />
        </button>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputRef}
          onChange={handleImageChange}
        />
      </div>

      {name && (
        <div className="text-center">
          <div className="text-xl font-bold text-[#ed6126]">{name}</div>
          {rank && <div className="text-sm text-gray-600">{rank}</div>}
        </div>
      )}

      <div className="flex flex-col items-center gap-1 text-gray-700 text-sm font-medium">
        {streak !== undefined && (
          <span className="flex items-center gap-1">
            <FaFire className="text-red-500" /> {streak} day streak
          </span>
        )}
        {points !== undefined && (
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {points} pts
          </span>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
