// src/pages/GenderPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MuscleMap from '../components/WorkoutPlans/MuscleMapViewer';

const GenderPage = () => {
  const { gender } = useParams(); 

  return (
    <div>
      <MuscleMap gender={gender} />         
    </div>
  );
};

export default GenderPage;
