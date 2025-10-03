import React from 'react';
import heroBg from '../../assets/herosectionimage.jpg';
import { Link } from 'react-router-dom';
import StreakCalender from '../Homepage/StreakCalender';

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] rounded-xl overflow-hidden text-white">
      {/* 2-column content */}
      <div className="relative z-10 h-full flex w-full gap-8 px-8 py-8">
        {/* Left Column: 60% width with background image */}
        <div
          className="flex-[2] flex flex-col justify-end px-6 py-6 rounded-xl bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 text-shadow-md">
            Unlock your true potential with
            <br />
            <span className="text-white">Fitness and health guru</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/ai">
              <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-md hover:bg-gray-200 transition">
                Try Fitby-AI
              </button>
            </Link>
            <Link to="/blogs">
              <button className="bg-white text-gray-900 font-semibold px-5 py-2 rounded-md flex items-center gap-2 shadow hover:bg-gray-100 transition">
                <span>Read New Blogs</span>
                <img
                  src={heroBg}
                  alt="blog icon"
                  className="h-6 w-6 rounded-full object-cover"
                />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: 40% width with streak calendar at top */}
        <div className="flex-[0.4] flex flex-col justify-start items-center gap-2">
          {/* Streak Calendar at top */}
          <StreakCalender />

          {/* Motivational section below */}
          <div className="flex flex-col items-center text-center mt-auto gap-4">
            <p className="text-gray-500 text-sm">
              Keep up the momentum! Every streak brings you closer to your fitness goals. Stay consistent and never miss a day.
            </p>
            <button className="bg-orange-500 text-black font-semibold px-6 py-3 rounded-md hover:bg-orange-600 transition">
              Start Today's Streak Task
            </button>
            {/* Info Link */}
            <a href="/streak-info" className="text-sm text-orange-500 hover:underline">
              Learn more about streaks
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
