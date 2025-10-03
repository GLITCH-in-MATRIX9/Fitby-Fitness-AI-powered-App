import React, { useEffect, useState, useRef, useCallback } from "react";
import PoseTracker from "./PoseTracker";

// --- Utility to extract YouTube ID ---
const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

// --- Component ---
const VideoSection = ({ muscle, gender, newVideo }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewTime, setViewTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [rewardStatus, setRewardStatus] = useState({ half: false, full: false });
  const [skipDetected, setSkipDetected] = useState(false);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const ytScriptLoaded = useRef(false);

  // --- Fetch videos ---
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://fitby-fitness-ai-powered-app.onrender.com/api/videos?muscle=${muscle}&gender=${gender}`
        );
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [muscle, gender]);

  // --- Add new video dynamically ---
  useEffect(() => {
    if (newVideo) setVideos((prev) => [newVideo, ...prev]);
  }, [newVideo]);

  // --- Progress Tracking ---
  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateProgress = useCallback(() => {
    const player = playerRef.current;
    if (!player || player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
      stopProgressTracking();
      return;
    }

    const currentTime = player.getCurrentTime();

    setViewTime((prevTime) => {
      const skipTolerance = 2;
      const isSkipping = prevTime > 0 && Math.abs(currentTime - prevTime) > skipTolerance;

      if (isSkipping) {
        stopProgressTracking();
        setRewardStatus({ half: false, full: false });
        setSkipDetected(true);
        player.pauseVideo();
        console.warn(`Skipping detected! Progress reset.`);
        return 0;
      }

      if (skipDetected) setSkipDetected(false);
      return currentTime;
    });

    setRewardStatus((prev) => {
      if (!videoDuration) return prev;
      const halfThreshold = videoDuration * 0.5;
      const fullThreshold = videoDuration;

      let newStatus = { ...prev };
      if (currentTime >= halfThreshold && !prev.half) {
        newStatus.half = true;
        console.log("Reward granted: Half Video Completed!");
      }
      if (currentTime >= fullThreshold && !prev.full) {
        newStatus.full = true;
        stopProgressTracking();
        console.log("Reward granted: FULL Video Completed!");
      }
      return newStatus;
    });
  }, [videoDuration, skipDetected, stopProgressTracking]);

  const startProgressTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 500);
  }, [updateProgress]);

  // --- Load YouTube API script once ---
  useEffect(() => {
    if (!ytScriptLoaded.current) {
      if (typeof window.YT === "undefined" || !window.YT.Player) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      ytScriptLoaded.current = true;
    }
  }, []);

  // --- Initialize YouTube Player ---
  useEffect(() => {
    if (!selectedVideo) return;

    const videoId = getYouTubeId(selectedVideo.videoUrl);
    if (!videoId) return;

    const initPlayer = () => {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("player-container", {
        videoId,
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onReady: (event) => setVideoDuration(event.target.getDuration()),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) startProgressTracking();
            else stopProgressTracking();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopProgressTracking();
      if (window.onYouTubeIframeAPIReady === initPlayer) window.onYouTubeIframeAPIReady = null;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, [selectedVideo, startProgressTracking, stopProgressTracking]);

  // --- Handlers ---
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setViewTime(0);
    setVideoDuration(0);
    setRewardStatus({ half: false, full: false });
    setSkipDetected(false);
    stopProgressTracking();
  };

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setSkipDetected(false);
    stopProgressTracking();
    if (playerRef.current && typeof playerRef.current.destroy === "function") {
      playerRef.current.destroy();
    }
  }, [stopProgressTracking]);

  const progressPercentage = videoDuration ? (viewTime / videoDuration) * 100 : 0;

  // --- Render ---
  if (loading) return <p className="p-4 text-gray-500">Loading videos...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (videos.length === 0)
    return (
      <p className="p-4 text-gray-500">
        No videos found for {muscle} ({gender}).
      </p>
    );

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg mt-6">
      <h3 className="text-2xl font-bold mb-6 text-[#111827]">
        {muscle.charAt(0).toUpperCase() + muscle.slice(1)} Workouts for{" "}
        {gender.charAt(0).toUpperCase() + gender.slice(1)}
      </h3>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const id = getYouTubeId(video.videoUrl);
          if (!id) return null;
          return (
            <div
              key={video._id}
              className="relative cursor-pointer rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-[1.03] border-4 border-transparent hover:border-[#e9632e]/50"
              onClick={() => handleVideoSelect(video)}
            >
              <img
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt={video.title || "Workout video"}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/640x360/ccc/fff?text=No+Thumbnail";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-25 hover:bg-opacity-50 transition">
                <svg
                  className="w-14 h-14 text-white opacity-90 transition-opacity"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-900/90 to-transparent">
                <p className="text-white font-bold truncate text-base">{video.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="bg-white rounded-xl w-full max-w-6xl overflow-hidden shadow-2xl relative transform transition-all duration-300">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-3xl z-10 p-2 leading-none"
              onClick={handleModalClose}
            >
              &times;
            </button>

            {/* Flex container: YouTube Left, PoseTracker Right */}
            <div className="flex flex-col lg:flex-row">
              {/* Left: YouTube Player */}
              <div className="flex-1 bg-black">
                <div id="player-container" className="aspect-video w-full bg-black flex items-center justify-center text-white">
                  Loading Video Player...
                </div>
              </div>

              {/* Right: Pose Tracker */}
              <div className="flex-1 p-4 bg-gray-50">
                <h2 className="text-xl font-bold mb-2">Posture Tracker</h2>
                <PoseTracker
                  onAnglesUpdate={(angles) => {
                    // Optional: use angles for rewards/feedback
                    console.log("Angles:", angles);
                  }}
                />
              </div>
            </div>

            {/* Progress & Rewards Section (unchanged) */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <h2 className="text-2xl font-extrabold text-[#111827] mb-2">{selectedVideo.title}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {selectedVideo.description ||
                  "Watch the video to track your progress and earn rewards!"}
              </p>

              <div className={`mb-4 p-3 rounded-lg flex items-center transition-colors duration-300 ${skipDetected
                ? "bg-red-100 border border-red-400 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
                }`}
              >
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                <p className="text-sm font-medium">
                  {skipDetected
                    ? "Skipping Detected: Progress reset. Please play continuously."
                    : "Progress is tracked only during continuous playback."}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700">Progress: {Math.round(progressPercentage)}%</span>
                  <span className="text-sm text-gray-500">{Math.floor(viewTime)}s / {Math.floor(videoDuration)}s</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="h-full bg-[#e9632e] transition-all duration-500 ease-linear rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <div className="absolute top-0 h-full w-px bg-white/50" style={{ left: '50%' }}></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2 justify-center sm:justify-start">
                <div className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${rewardStatus.half ? "bg-green-100 text-green-700 shadow-md" : "bg-gray-100 text-gray-400"
                  }`}>
                  <span className="text-xl">{rewardStatus.half ? "✅" : "⚪"}</span>
                  <span className="text-sm font-medium">Half Completed Reward ({Math.floor(videoDuration * 0.5)}s)</span>
                </div>
                <div className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${rewardStatus.full ? "bg-[#e9632e]/10 text-[#e9632e] border border-[#e9632e]/50 shadow-md" : "bg-gray-100 text-gray-400"
                  }`}>
                  <span className="text-xl">{rewardStatus.full ? "🏆" : "⚪"}</span>
                  <span className="text-sm font-medium">Full Completion Reward ({Math.floor(videoDuration)}s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VideoSection;
