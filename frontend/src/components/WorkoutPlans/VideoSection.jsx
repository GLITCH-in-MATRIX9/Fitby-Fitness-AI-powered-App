import React, { useEffect, useState } from "react";
import VideoTools from "./VideoTools";

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

const VideoSection = ({ muscle, gender }) => {
  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="text-gray-500">Loading videos...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (videos.length === 0) return <p className="text-gray-500">No videos found.</p>;

  if (activeVideo) {
    const videoId = getYouTubeId(activeVideo.videoUrl);
    return (
      <div className="flex flex-col items-center mt-6 space-y-6 px-4">
        <button
          onClick={() => setActiveVideo(null)}
          className="self-start mb-2 text-sm text-blue-600 hover:underline"
        >
          ← Back to all videos
        </button>

        <div className="w-full max-w-4xl aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={activeVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <h2 className="text-xl font-semibold">{activeVideo.title}</h2>
        <p className="text-gray-600 text-center max-w-3xl">{activeVideo.description}</p>

        <VideoTools videoId={videoId} />
      </div>
    );
  }

  return (
    <div className="mt-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos
          .map((video) => {
            const id = getYouTubeId(video.videoUrl);
            if (!id) return null; // skip invalid video URLs
            return (
              <div
                key={video._id}
                className="w-full h-64 cursor-pointer relative rounded-lg overflow-hidden shadow"
                onClick={() => setActiveVideo(video)}
              >
                <img
                  src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                  alt={video.title || "Workout video"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            );
          })
        }

      </div>
    </div>
  );
};

export default VideoSection;
