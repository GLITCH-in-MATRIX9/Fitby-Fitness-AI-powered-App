import React, { useState, useEffect, useContext } from "react";
import {
  FaDumbbell,
  FaCalendarAlt,
  FaClock,
  FaFire,
  FaStar,
  FaDownload,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const WorkoutHistory = () => {
  const { token, user, setUser } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toLocaleDateString("en-CA"),
    duration: "",
    workout: "",
  });
  const [loading, setLoading] = useState(false);
  const [todayDateStr, setTodayDateStr] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleDateString("en-CA");
      setTodayDateStr((prev) => (prev !== now ? now : prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch workouts");
        const data = await res.json();
        const normalized = data.map((item) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString("en-CA"),
        }));
        setHistory(normalized);
      } catch (err) {
        console.error("Error fetching workouts:", err.message);
      }
    };
    fetchHistory();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.duration || !form.workout) {
      alert("Please fill in all fields");
      return;
    }

    const minutes = parseInt(form.duration);
    const calories = isNaN(minutes) ? 0 : minutes * 8;
    const points = Math.round(calories / 10);

    setLoading(true);
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, calories, points }),
      });

      if (!res.ok) throw new Error("Failed to add workout");

      const newWorkout = await res.json();
      newWorkout.date = new Date(newWorkout.date).toLocaleDateString("en-CA");

      // Add workout to list
      setHistory((prev) => [newWorkout, ...prev]);

      // Update user points instantly in AuthContext
      if (setUser && user) {
        setUser((prevUser) => ({
          ...prevUser,
          points: (prevUser.points || 0) + points,
        }));
      }

      setForm({ date: todayDateStr, duration: "", workout: "" });
    } catch (err) {
      console.error("Error adding workout:", err.message);
      alert("Error adding workout");
    } finally {
      setLoading(false);
    }
  };

  const todaysWorkouts = history.filter((entry) => entry.date === todayDateStr);

  const handleDownload = () => {
    const filename = `workout_history_${todayDateStr}.json`;
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-[#ed6126] mb-4">
        <FaDumbbell />
        <h2 className="text-2xl font-bold">Today's Workout</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            type="text"
            name="workout"
            placeholder="Workout Name"
            value={form.workout}
            onChange={handleChange}
            className="border rounded px-3 py-2 flex-1"
            required
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (in minutes)"
            value={form.duration}
            onChange={handleChange}
            className="border rounded px-3 py-2 flex-1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#ed6126] text-white px-5 py-2 rounded hover:bg-[#d3551f]"
        >
          {loading ? "Logging..." : "Log Workout"}
        </button>
      </form>

      <div className="space-y-4">
        {todaysWorkouts.length === 0 && (
          <div className="text-gray-500 italic">No workouts logged today.</div>
        )}
        {todaysWorkouts.map((session, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-xl shadow flex justify-between items-center border hover:shadow-md transition"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaDumbbell className="text-[#ed6126]" />
                {session.workout}
              </h3>
              <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" /> {session.date}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-gray-400" /> {session.duration}
                </span>
                <span className="flex items-center gap-1">
                  <FaFire className="text-gray-400" /> {session.calories} kcal
                </span>
                <span className="flex items-center gap-1 text-[#ed6126] font-medium">
                  <FaStar className="text-[#ed6126]" /> +{session.points} pts
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 italic hidden sm:block">Keep it up!</div>
          </div>
        ))}
      </div>

      <div className="pt-4 text-right">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-[#ed6126] text-white px-4 py-2 rounded hover:bg-[#d3551f]"
        >
          <FaDownload /> Download Full Month
        </button>
      </div>
    </div>
  );
};

export default WorkoutHistory;
