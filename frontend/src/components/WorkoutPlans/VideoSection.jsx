import React, { useEffect, useState, useRef, useCallback } from "react";
import PoseTracker from "./PoseTracker";

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

const VideoSection = ({ muscle, gender, newVideo }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewTime, setViewTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [rewardStatus, setRewardStatus] = useState({ half: false, full: false });
  const [skipDetected, setSkipDetected] = useState(false);
  const [squatScore, setSquatScore] = useState(0);
  const [squatTimer, setSquatTimer] = useState(0);


  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const ytScriptLoaded = useRef(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:5000/api/videos?muscle=${muscle}&gender=${gender}`
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

  useEffect(() => {
    if (newVideo) setVideos((prev) => [newVideo, ...prev]);
  }, [newVideo]);

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
      const skipTolerance = 1;
      const isSkipping = prevTime > 0 && Math.abs(currentTime - prevTime) > skipTolerance;

      if (isSkipping && currentTime < videoDuration * 0.95) {
        stopProgressTracking();
        setRewardStatus({ half: false, full: false });
        setSkipDetected(true);
        player.pauseVideo();
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
      if (currentTime >= halfThreshold && !prev.half) newStatus.half = true;
      if (currentTime >= fullThreshold && !prev.full) newStatus.full = true;
      return newStatus;
    });
  }, [videoDuration, skipDetected, stopProgressTracking]);

  const startProgressTracking = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateProgress, 500);
  }, [updateProgress]);

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

  useEffect(() => {
    if (!selectedVideo) return;
    const videoId = getYouTubeId(selectedVideo.videoUrl);
    if (!videoId) return;

    const initPlayer = () => {
      if (playerRef.current?.destroy) playerRef.current.destroy();

      playerRef.current = new window.YT.Player("player-container", {
        videoId,
        playerVars: { autoplay: 1, controls: 1 },
        events: {
          onReady: (event) => setVideoDuration(event.target.getDuration()),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) startProgressTracking();
            else stopProgressTracking();
            if (event.data === window.YT.PlayerState.ENDED)
              setRewardStatus((prev) => ({ ...prev, full: true }));
          },
        },
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      stopProgressTracking();
      if (window.onYouTubeIframeAPIReady === initPlayer) window.onYouTubeIframeAPIReady = null;
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [selectedVideo, startProgressTracking, stopProgressTracking]);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setViewTime(0);
    setVideoDuration(0);
    setRewardStatus({ half: false, full: false });
    setSkipDetected(false);
    setSquatScore(0);
    stopProgressTracking();
  };

  const handleModalClose = useCallback(() => {
    setSelectedVideo(null);
    setSkipDetected(false);
    setSquatScore(0);
    stopProgressTracking();
    if (playerRef.current?.destroy) playerRef.current.destroy();
  }, [stopProgressTracking]);

  const progressPercentage = videoDuration ? (viewTime / videoDuration) * 100 : 0;

  if (loading) return <p className="p-4 text-gray-500">Loading videos...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!videos.length) return <p className="p-4 text-gray-500">No videos found for {muscle} ({gender}).</p>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg mt-6">
      <h3 className="text-2xl font-bold mb-6 text-[#111827]">
        {muscle.charAt(0).toUpperCase() + muscle.slice(1)} Workouts for{" "}
        {gender.charAt(0).toUpperCase() + gender.slice(1)}
      </h3>

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
                  e.target.src = "https://placehold.co/740x360/ccc/fff?text=No+Thumbnail";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-25 hover:bg-opacity-50 transition">
                <svg className="w-14 h-14 text-white opacity-90 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
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

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" style={{ backdropFilter: "blur(8px)" }}>
          <div className="bg-white rounded-xl w-full max-w-6xl overflow-hidden shadow-2xl relative transform transition-all duration-300">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-3xl z-10 p-2 leading-none"
              onClick={handleModalClose}
            >
              &times;
            </button>

            <div className="flex flex-col lg:flex-row gap-4 p-4">
              <div className="flex flex-col flex-1 space-y-4">
                <div className="bg-black rounded-xl overflow-hidden shadow-md">
                  <div id="player-container" className="w-full aspect-video bg-black flex items-center justify-center text-white">
                    Loading Video Player...
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800">Rewards</h4>
                  <div className="flex flex-col space-y-3">
                    <div className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${rewardStatus.half ? "bg-green-100 text-green-700 shadow-sm" : "bg-gray-100 text-gray-400"}`}>
                      <span className="text-xl">{rewardStatus.half ? "✅" : "⚪"}</span>
                      <span className="text-sm font-medium">
                        Half Completed Reward ({Math.floor(videoDuration * 0.5)}s)
                      </span>
                    </div>

                    <div className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${rewardStatus.full ? "bg-[#e9632e]/10 text-[#e9632e] border border-[#e9632e]/50 shadow-sm" : "bg-gray-100 text-gray-400"}`}>
                      <span className="text-xl">{rewardStatus.full ? "🏆" : "⚪"}</span>
                      <span className="text-sm font-medium">
                        Full Completion Reward ({Math.floor(videoDuration)}s)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gray-100 rounded-xl flex flex-col items-center justify-center border border-gray-200 p-4">
                <PoseTracker
                  exerciseName={selectedVideo.exerciseName || "workout"}
                  onScoreUpdate={setSquatScore}
                  onSquatTimerUpdate={setSquatTimer}
                />
                <div className="mt-4 p-2 bg-gray-200 rounded-lg text-center font-bold text-lg w-full">
                  Squat Score: {squatScore}
                </div>
                <div className="mt-2 p-2 bg-gray-200 rounded-lg text-center font-medium text-lg w-full">
                  Squat Timer: {squatTimer}s
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
