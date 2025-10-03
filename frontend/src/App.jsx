import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';

import Blogs from './pages/Blogs';
import WorkOut from './assets/WorkOutPlans';
import PersonalizedTrainer from './pages/PersonalizedTrainer';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DietPlanPage from './pages/DietPlanPage';
import LoginPage from './pages/LoginPage';
import FitbyBot from './pages/FitbyBot';
import MaleWorkout from './components/WorkoutPlans/MaleWorkout';
import FemaleWorkout from './components/WorkoutPlans/FemaleWorkout';
import GenderPage from './pages/GenderPage';
import AdminForm from './pages/AdminForm';
import Profile from './pages/Profile';
import DashboardLayout from "./components/UserProfile/DashboardLayout";
import ProfileOverview from "./components/UserProfile/ProfileOverview";
import FitnessGoals from "./components/UserProfile/FitnessChallenges";
import WorkoutHistory from "./components/UserProfile/WorkoutHistory";
import Settings from "./components/UserProfile/Settings";
import ManageBlogs from "./components/UserProfile/ManageBlogs";
import Leaderboard from './pages/Leaderboard';
import ChangePassword from './components/UserProfile/ChangePassword';



const AppContent = () => {
  const location = useLocation();

  // Hide footer if current path starts with /admin
  const hideFooter = location.pathname.startsWith('/admin');

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blogs' element={<Blogs />} />
        <Route path='/workoutplans' element={<WorkOut />} />
        <Route path='/personalized-trainer' element={<PersonalizedTrainer />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/ai' element={<FitbyBot />} />
        <Route path='/workoutplans/:gender' element={<GenderPage />} />
        <Route path='/admin' element={<AdminForm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/change-password" element={<ChangePassword />} />

  {/* New Diet Plan Page */}
  <Route path="/diet-plan" element={<DietPlanPage />} />

        {/* Profile layout and nested routes */}
        <Route path="/profile" element={<DashboardLayout />}>
          <Route index element={<ProfileOverview />} />
          <Route path="goals" element={<FitnessGoals />} />
          <Route path="history" element={<WorkoutHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="blogs" element={<ManageBlogs />} />
        </Route>
      </Routes>


      {!hideFooter && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
