import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'; // Added Recharts imports

// Inline SVG Icons (Replacing react-icons/ai, react-icons/bs, react-icons/md)

// Icon for Video Camera (AiOutlineVideoCamera)
const VideoIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.764v6.472a1 1 0 01-1.447.894L15 14M4 18h10a2 2 0 002-2V8a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
// Icon for User (AiOutlineUser)
const UserIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
// Icon for Line Chart (AiOutlineLineChart)
const ChartIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 6-6m-4-6v4h4"></path></svg>
);
// Icon for Clock History (BsClockHistory)
const ClockIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
// Icon for Add Circle (MdOutlineAddCircleOutline)
const AddIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);


const StatsPage = () => {
  const [stats, setStats] = useState({
    totalVideos: 0,
    maleVideos: 0,
    femaleVideos: 0,
    trendingMuscle: 'N/A',
    chartData: [], // New state to hold data for the chart
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching and Calculation Logic ---
  const fetchStats = async () => {
    try {
      // 1. Fetch the videos list
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/videos");
      if (!res.ok) {
        throw new Error("Failed to fetch video data from backend.");
      }
      const videos = await res.json();

      // 2. Calculate Statistics
      const totalVideos = videos.length;
      let maleVideos = 0;
      let femaleVideos = 0;
      const muscleCounts = {};

      videos.forEach(video => {
        const gender = video.gender ? video.gender.toLowerCase() : 'both';
        const muscle = video.muscle || 'unknown';

        // Count gender-specific videos
        if (gender === 'male') maleVideos++;
        if (gender === 'female') femaleVideos++;
        if (gender === 'both') {
          maleVideos++;
          femaleVideos++;
        }

        // Count muscle occurrences
        muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
      });

      // 3. Determine Trending Muscle AND Prepare Chart Data
      let trendingMuscle = 'N/A';
      let maxCount = 0;

      // Convert muscleCounts object to chart data array
      const chartData = Object.entries(muscleCounts)
        .map(([id, count]) => {
          // Format muscle name for display
          const name = id.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');

          if (count > maxCount) {
            maxCount = count;
            trendingMuscle = name;
          }

          return { name: name, count: count };
        })
        .filter(item => item.count > 0 && item.name !== 'Unknown') // Filter valid data
        .sort((a, b) => b.count - a.count); // Sort by count

      setStats({
        totalVideos,
        maleVideos,
        femaleVideos,
        trendingMuscle,
        chartData, // Set the prepared chart data
      });

      // 4. Set Recent Activity (using the last 3 videos for simplicity)
      const recent = videos.slice(0, 3).map(video => ({
        title: video.title,
        gender: video.gender,
        time: "Just now" // Placeholder for time since creation time isn't available
      }));
      setRecentActivity(recent);

    } catch (err) {
      console.error("Error loading dashboard data:", err);
      // Fallback to default stats if API fails
      setStats({ totalVideos: 0, maleVideos: 0, femaleVideos: 0, trendingMuscle: 'N/A', chartData: [] });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Custom tooltip for the Bar Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-md text-sm text-gray-800">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-[#e9632e]">{`Videos: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="p-10 bg-gray-50 min-h-screen font-inter text-gray-800">

      {/* Header and Horizontal Line */}
      <div className="mb-4">
        <div className="w-1/2 h-px bg-gray-300 ml-[50%] mb-8"></div>
        <div className="flex items-center gap-2 mb-8">
          <ChartIcon size={28} className="text-[#e9632e] w-7 h-7" />
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 italic">Loading statistics...</div>
      ) : (
        <>
          {/* Stat Cards - Clean White Cards with Accent Borders/Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            {/* Total Videos (Orange Accent) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#e9632e] transition-all hover:shadow-xl hover:scale-[1.02]">
              <VideoIcon size={36} className="text-[#e9632e] w-9 h-9 mb-3" />
              <p className="text-gray-500 text-sm uppercase font-medium">Total Videos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalVideos}</h3>
            </div>

            {/* Male Videos (Blue Accent) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 transition-all hover:shadow-xl hover:scale-[1.02]">
              <UserIcon size={36} className="text-blue-500 w-9 h-9 mb-3" />
              <p className="text-gray-500 text-sm uppercase font-medium">Male Videos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.maleVideos}</h3>
            </div>

            {/* Female Videos (Pink Accent) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-400 transition-all hover:shadow-xl hover:scale-[1.02]">
              <UserIcon size={36} className="text-pink-400 w-9 h-9 mb-3" />
              <div>
                <p className="text-gray-500 text-sm uppercase font-medium">Female Videos</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.femaleVideos}</h3>
              </div>
            </div>

            {/* Trending Muscle (Green Accent) */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between border-t-4 border-green-500 transition-all hover:shadow-xl hover:scale-[1.02]">
              <ChartIcon size={36} className="text-green-500 w-9 h-9 mb-3" />
              <div>
                <p className="text-gray-500 text-sm uppercase font-medium">Trending Muscle</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.trendingMuscle}</h3>
              </div>
            </div>
          </div>

          {/* Video Distribution Chart (Actual Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10 border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ChartIcon size={22} className="w-5 h-5 text-gray-500" /> Video Distribution by Muscle
              </h3>
              <span className="text-sm text-gray-500">Total Muscles: {stats.chartData.length}</span>
            </div>

            {stats.chartData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" stroke="#333" tick={{ fontSize: 10 }} height={40} />
                    <YAxis stroke="#333" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#e9632e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 italic border border-dashed border-gray-300">
                No video data available to generate chart.
              </div>
            )}
          </div>

          {/* Recent Activity - Minimalist White Card */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4 border-b pb-4">
              <ClockIcon size={20} className="text-[#e9632e] w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Upload Activity</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <AddIcon className="text-green-600 w-4 h-4 flex-shrink-0" />
                    Added <strong>"{activity.title}"</strong> for <span className="capitalize text-gray-800 font-semibold">{activity.gender}</span> ({activity.time})
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic p-2">No recent video uploads found.</li>
              )}
            </ul>
          </div>

          {/* Bottom Horizontal Line */}
          <div className="w-1/2 h-px bg-gray-300 mr-[50%] mt-8"></div>
        </>
      )}
    </div>
  );
};

export default StatsPage;
