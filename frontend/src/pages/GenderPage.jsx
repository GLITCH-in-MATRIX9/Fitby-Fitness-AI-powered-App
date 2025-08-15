// src/pages/GenderPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import MuscleMap from '../components/WorkoutPlans/MuscleMapViewer';

const GenderPage = () => {
  const { gender } = useParams();  // This grabs "male" or "female" from the URL

  return (
    <div>
      <MuscleMap gender={gender} />         
    </div>
  );
};

export default GenderPage;
