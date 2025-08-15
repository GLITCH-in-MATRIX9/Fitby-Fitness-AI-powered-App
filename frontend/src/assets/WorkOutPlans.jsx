import React from 'react';
import { useNavigate } from 'react-router-dom';
import male from '../assets/male.jpg';
import female from '../assets/female.jpg';

const GenderSelection = () => {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">
      {/* Male Option */}
      <div
        className="relative cursor-pointer group"
        onClick={() => navigate('/workoutplans/male')}
      >
        <img
          src={male}
          alt="Male Workout"
          className="w-full h-full object-cover max-h-[700px]"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-wide">Male</h2>
        </div>
      </div>

      {/* Female Option */}
      <div
        className="relative cursor-pointer group"
        onClick={() => navigate('/workoutplans/female')}
      >
        <img
          src={female}
          alt="Female Workout"
          className="w-full h-full object-cover max-h-[700px]"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-bold tracking-wide">Female</h2>
        </div>
      </div>
    </section>
  );
};

export default GenderSelection;
