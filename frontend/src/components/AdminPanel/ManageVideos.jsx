
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const ManageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete video by ID
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this video?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setVideos(videos.filter((v) => v._id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error while deleting");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <main className="flex-1 p-10 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-[#e9632e]">Manage Workout Videos</h2>

      {loading ? (
        <p className="text-gray-600 italic">Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-600 italic">No videos found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-[#111827] text-white">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Video ID</th>
                <th className="px-4 py-2">Muscle</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id} className="border-t">
                  <td className="px-4 py-2">{video.title}</td>
                  <td className="px-4 py-2">{video.videoId}</td>
                  <td className="px-4 py-2 capitalize">{video.muscle}</td>
                  <td className="px-4 py-2 capitalize">{video.gender}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <AiOutlineDelete size={18} />
                    </button>
                    <button
                      onClick={() => alert("Edit modal coming soon!")}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <AiOutlineEdit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default ManageVideos;
