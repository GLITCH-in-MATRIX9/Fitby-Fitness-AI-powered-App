import React, { useState } from 'react';
import FemaleFront from '../svg/FemaleFront';
import FemaleBack from '../svg/FemaleBack';
import MaleFront from '../svg/MaleFront';
import MaleBack from '../svg/MaleBack';
import VideoSection from './VideoSection';
import { useNavigate } from "react-router-dom";

const MuscleMap = ({ gender = 'female' }) => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const navigate = useNavigate();

  const handleMuscleClick = (muscleId) => {
    setSelectedMuscle(muscleId);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      {/* 🟠 Top prompt above both sections */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Click on any muscle to get a recommended workout video
        </h2>
        <p className="text-gray-600 mt-2">Explore exercises tailored to your goals</p>
      </div>

      {/* Two-column layout */}
      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-10">
        {/* Left: Video Section */}
        <div className="flex-1">
          {selectedMuscle ? (
            <VideoSection muscle={selectedMuscle} gender={gender} />
          ) : (
            <p className="text-gray-500">No muscle selected yet.</p>
          )}
        </div>

        {/* Right: SVGs */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 flex-1">
          {gender === 'female' ? (
            <>
              <FemaleFront
                onMuscleClick={handleMuscleClick}
                selectedMuscle={selectedMuscle}
                className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto"
              />
              <FemaleBack
                onMuscleClick={handleMuscleClick}
                selectedMuscle={selectedMuscle}
                className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto"
              />
            </>
          ) : (
            <>
              <MaleFront
                onMuscleClick={handleMuscleClick}
                selectedMuscle={selectedMuscle}
                className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto"
              />
              <MaleBack
                onMuscleClick={handleMuscleClick}
                selectedMuscle={selectedMuscle}
                className="w-52 sm:w-64 md:w-72 lg:w-80 h-auto"
              />
            </>
          )}
        </div>
      </div>


      {/* Blog CTA */}
      <div className="mt-16 bg-[#e9632e] border border-gray-200 rounded-xl p-8 text-center shadow-md">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Stay inspired with our expert-written blogs
        </h3>
        <p className="text-white mb-6">
          Discover practical advice, health tips, and wellness insights curated by our FitBy community.
        </p>
        <button
          onClick={() => navigate("/blogs")}
          className="px-6 py-3 bg-white text-[#e9632e] rounded-lg font-semibold transition"
        >
          View All Blogs
        </button>
      </div>
    </div>
  );
};

export default MuscleMap;
