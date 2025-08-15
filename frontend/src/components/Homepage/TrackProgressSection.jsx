import React from 'react'
import { Link } from 'react-router-dom'
import StreakCalendar from './StreakCalender' 
import mainImage from '../../assets/man-stretching.png'

const TrackProgressSection = () => {
  
  const streakData = {
    "2025-07-15": true,
    "2025-07-16": true,
    "2025-07-20": true,
    "2025-07-22": true,
  };

  return (
    <section className="my-16 px-6 md:px-12 flex flex-col md:flex-row gap-8 items-center md:items-stretch">

      {/* Left: Streak Calendar with text above and below */}
      <div className="bg-orange-500 text-white rounded-xl p-6 md:w-[42%] flex flex-col justify-center space-y-6">

        {/* Text Above Calendar */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Your Progress</h2>
          <p className="text-orange-100">Keep up the great work! Track your daily streaks and stay motivated.</p>
        </div>

        {/* Calendar */}
        <StreakCalendar streakData={streakData} />

        {/* Text Below Calendar */}
        <div className="text-center">
          <p className="text-orange-100">
            Click any date to see the tasks you completed that day.
            <br />
            Consistency is key to building strong habits!
          </p>
          <Link to="/workoutplans" className="inline-block mt-4 bg-white text-orange-600 font-semibold px-5 py-2 rounded-full hover:bg-orange-100 transition">
            Discover Workout Plans
          </Link>
        </div>
      </div>

      {/* Right: Visual Layout */}
      <div className="relative md:w-[58%] rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={mainImage}
          alt="Athlete"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

    </section>
  );
}

export default TrackProgressSection;
