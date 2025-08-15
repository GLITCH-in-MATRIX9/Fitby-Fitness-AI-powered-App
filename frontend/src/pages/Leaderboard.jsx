import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaRunning } from "react-icons/fa";

const getFitnessRank = (points) => {
  if (points >= 1000) return "Beast";
  if (points >= 600) return "Warrior";
  if (points >= 300) return "Fighter";
  return "Beginner";
};

const Leaderboard = () => {
  const { token, user: currentUser } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/user/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch leaderboard");

        const data = await res.json();

        let ranked = [];

        if (Array.isArray(data) && data.length > 0) {
          ranked = data
            .sort((a, b) => b.points - a.points)
            .map((user, index) => ({
              ...user,
              rank: index + 1,
              image: user.image
                ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${user.image}`
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            }));
        }

        // Include current user if not in leaderboard
        if (!ranked.find((u) => u._id === currentUser._id)) {
          ranked.push({
            ...currentUser,
            name: currentUser.name || "You",
            rank: "—",
            image: currentUser.image
              ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${currentUser.image}`
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          });
        }

        setLeaderboard(ranked);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, currentUser]);

  if (loading) return <p className="p-4">Loading leaderboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">🏆 Leaderboard</h1>

      <div className="flex flex-col divide-y divide-gray-200">
        {leaderboard.map((userEntry, index) => {
          const isCurrentUser = userEntry._id === currentUser._id;
          return (
            <div
              key={index}
              className={`flex items-center justify-between py-4 px-4 rounded-md 
                ${isCurrentUser ? "bg-yellow-100 border border-yellow-400 shadow-md" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex items-center gap-5">
                <div className="text-lg font-semibold w-8 text-gray-700">{userEntry.rank}</div>
                <img
                  src={userEntry.image}
                  alt={userEntry.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <div
                    className={`font-semibold ${isCurrentUser ? "text-yellow-800" : "text-gray-900"
                      }`}
                  >
                    {userEntry.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getFitnessRank(userEntry.points)}
                  </div>
                </div>
              </div>
              <div
                className={`text-lg font-bold ${isCurrentUser ? "text-yellow-800" : "text-[#ed6126]"
                  }`}
              >
                {userEntry.points} pts
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
