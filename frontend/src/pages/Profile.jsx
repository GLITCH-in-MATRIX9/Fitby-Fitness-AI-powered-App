import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logout();
          navigate("/login");
        } else {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout, navigate]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#ed6126] mb-4">Your Profile</h1>
      <p><strong>Name:</strong> {profile?.name}</p>
      <p><strong>Email:</strong> {profile?.email}</p>
    </div>
  );
};

export default Profile;
