import React from "react";
import HeroSection from "../components/PersonalizedTrainerPage/HeroSection";
import FitnessInfoSection from "../components/PersonalizedTrainerPage/FitnessInfoSection";
import PackageSection from "../components/PersonalizedTrainerPage/PackageSection";

const PersonalizedTrainer = () => {
  return (
    <div className="mx-4 space-y-12">
      <HeroSection />
      <FitnessInfoSection />
      <PackageSection />
    </div>
  );
};

export default PersonalizedTrainer;