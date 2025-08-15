import React from "react";
import HeroSection from "../components/Homepage/HeroSection";
import WhyFitbySection from "../components/Homepage/WhyFitbySection";
import TrackProgressSection from "../components/Homepage/TrackProgressSection";
import HomeFeatures from "../components/Homepage/HomeFeatures";

const dummyStreakData = {
  "2025-07-15": true,
  "2025-07-16": true,
  "2025-07-17": true,
  "2025-07-20": true,
  // add more dates here
};

const Home = () => {
  return (
    <div className="mx-4 space-y-12">
      <HeroSection />
      <WhyFitbySection />
      <TrackProgressSection />
      <HomeFeatures />
    </div>
  );
};

export default Home;
