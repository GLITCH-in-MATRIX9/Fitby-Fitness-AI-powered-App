import React, { useEffect, useState } from "react";

// --- MUSCLE GROUPS DEFINITION WITH GENDER MAPPING ---
const MUSCLE_GROUPS_MAPPING = [
  { id: "abdominals", name: "Abdominals", genders: ["male", "female", "both"] },
  { id: "biceps", name: "Biceps", genders: ["male", "female", "both"] },
  { id: "calves", name: "Calves", genders: ["male", "female", "both"] },
  { id: "chest", name: "Chest", genders: ["male", "female", "both"] },
  { id: "forearms", name: "Forearms", genders: ["male", "female", "both"] },
  { id: "glutes", name: "Glutes", genders: ["male", "female", "both"] },
  { id: "hands", name: "Hands", genders: ["male", "female", "both"] },
  { id: "hamstrings", name: "Hamstrings", genders: ["male", "female", "both"] },
  { id: "lats", name: "Lats", genders: ["male", "female", "both"] },
  { id: "lowerback", name: "Lower Back", genders: ["male", "female", "both"] },
  { id: "middletraps", name: "Middle Traps", genders: ["male", "female", "both"] },
  { id: "obliques", name: "Obliques", genders: ["male", "female", "both"] },
  { id: "quads", name: "Quads", genders: ["male", "female", "both"] },
  { id: "triceps", name: "Triceps", genders: ["male", "female", "both"] },
  { id: "traps", name: "Traps", genders: ["male", "female", "both"] },
  { id: "trapsmiddle", name: "Traps Middle", genders: ["male", "female", "both"] },
  { id: "fshoulders", name: "Front Shoulders (Male)", genders: ["male", "both"] },
  { id: "rshoulders", name: "Rear Shoulders (Male)", genders: ["male", "both"] },
  { id: "frontshoulders", name: "Front Shoulders (Female)", genders: ["female", "both"] },
  { id: "rearshoulders", name: "Rear Shoulders (Female)", genders: ["female", "both"] },
];

const INITIAL_MUSCLE_ID = MUSCLE_GROUPS_MAPPING[0].id;


// --- Helper function to extract YouTube ID from URL ---
const getYoutubeId = (url) => {
  if (!url) return null;

  // Robust RegEx for various YouTube URL formats
  const match = url.match(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match && match[1] ? match[1] : null;
};


// --- ADD VIDEO FORM COMPONENT ---
const AddVideoForm = ({ onAdd, onMessage }) => {
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    muscle: INITIAL_MUSCLE_ID,
    gender: "male",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'gender') {
        const firstValidMuscle = MUSCLE_GROUPS_MAPPING.find(m => m.genders.includes(value))?.id;
        newFormData.muscle = firstValidMuscle || INITIAL_MUSCLE_ID;
      }

      return newFormData;
    });
  };

  const filteredMuscleGroups = MUSCLE_GROUPS_MAPPING.filter(m =>
    m.genders.includes(formData.gender)
  );


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onMessage(null);

    const videoId = getYoutubeId(formData.videoUrl);

    if (!videoId) {
      onMessage("Invalid YouTube URL. Please use a valid link.");
      setLoading(false);
      return;
    }

    try {
      await onAdd({
        ...formData,
        videoId: videoId,
        videoUrl: formData.videoUrl
      });

      setFormData((prev) => ({
        ...prev,
        title: "",
        videoUrl: "",
        muscle: filteredMuscleGroups[0]?.id || INITIAL_MUSCLE_ID,
      }));
      onMessage("Video added successfully!");
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e9632e] focus:border-[#e9632e]";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4 text-[#111827]">Add New Workout Video</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Video Title (e.g., Barbell Bench Press)"
          required
          className={`${inputClass} md:col-span-2`}
        />

        {/* YouTube URL */}
        <input
          type="url"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="YouTube URL (e.g., https://youtu.be/exampleID)"
          required
          className={`${inputClass} md:col-span-3`}
        />

        {/* Gender Dropdown */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="both">Both</option>
        </select>

        {/* Muscle Dropdown (DYNAMICALLY FILTERED) */}
        <select
          name="muscle"
          value={formData.muscle}
          onChange={handleChange}
          required
          className={`${inputClass} capitalize`}
        >
          {filteredMuscleGroups.map((muscle) => (
            <option key={muscle.id} value={muscle.id}>
              {muscle.name}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#e9632e] hover:bg-[#d65a26] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Video"}
        </button>
      </form>
    </div>
  );
};


// --- EDIT VIDEO MODAL COMPONENT ---
const EditVideoModal = ({ video, onUpdate, onClose, onMessage }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    videoUrl: video.videoUrl || `https://youtu.be/${video.videoId}`,
    muscle: video.muscle,
    gender: video.gender,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      if (name === 'gender') {
        const firstValidMuscle = MUSCLE_GROUPS_MAPPING.find(m => m.genders.includes(value))?.id;
        newFormData.muscle = firstValidMuscle || INITIAL_MUSCLE_ID;
      }
      return newFormData;
    });
  };

  const filteredMuscleGroups = MUSCLE_GROUPS_MAPPING.filter(m =>
    m.genders.includes(formData.gender)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onMessage(null);

    const videoId = getYoutubeId(formData.videoUrl);

    if (!videoId) {
      onMessage("Invalid YouTube URL. Please use a valid link.");
      setLoading(false);
      return;
    }

    try {
      await onUpdate(video._id, {
        ...formData,
        videoId: videoId,
        videoUrl: formData.videoUrl
      });
      onClose();
      onMessage("Video updated successfully!");
    } catch (error) {
      // Error handled by parent's onUpdate call
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full";

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h3 className="text-2xl font-bold mb-6 text-[#111827]">Edit Workout Video: {video.title}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muscle</label>
              <select name="muscle" value={formData.muscle} onChange={handleChange} required className={`${inputClass} capitalize`}>
                {filteredMuscleGroups.map((muscle) => (
                  <option key={muscle.id} value={muscle.id}>
                    {muscle.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 shadow-md"
            >
              {loading ? "Updating..." : "Update Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MANAGE VIDEOS COMPONENT (UPDATED CORE LOGIC) ---
const ManageVideos = ({ onVideoAdded }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
      setMessage(`Failed to fetch videos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const id = deleteId;
    setDeleteId(null);
    setMessage(null);

    try {
      const res = await fetch(`https://fitby-fitness-ai-powered-app.onrender.com/api/videos/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Video deleted successfully.");
        setVideos(videos.filter((v) => v._id !== id));
      } else {
        setMessage(data.error || "Failed to delete video.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(`Error while deleting: ${err.message}`);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    setMessage(null);
    try {
      const res = await fetch(`https://fitby-fitness-ai-powered-app.onrender.com/api/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const savedVideo = await res.json();

      if (res.ok) {
        setVideos(prevVideos => prevVideos.map(v =>
          v._id === id ? { ...v, ...updatedData } : v
        ));
      } else {
        throw new Error(savedVideo.error || "Failed to update video");
      }
    } catch (err) {
      console.error("Update video error:", err);
      setMessage(`Error updating video: ${err.message}`);
      throw err;
    }
  };

  const handleAddVideo = async (newVideo) => {
    setMessage(null);
    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo),
      });
      const savedVideo = await res.json();
      if (res.ok) {
        const videoWithUrl = {
          ...savedVideo,
          videoUrl: newVideo.videoUrl,
          videoId: newVideo.videoId
        };
        setVideos((prev) => [videoWithUrl, ...prev]);
        if (onVideoAdded) onVideoAdded(videoWithUrl);
        return true;
      } else {
        setMessage(savedVideo.error || "Failed to add video");
        return false;
      }
    } catch (err) {
      console.error("Add video error:", err);
      setMessage(`Error adding video: ${err.message}`);
      return false;
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setMessage(null);
  }

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setMessage(null);
  }


  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <main className="flex-1 p-10 min-h-screen font-inter">
      <h2 className="text-4xl font-extrabold mb-8 text-[#111827]">Video Library Management</h2>

      {/* Message and Delete Confirmation Modal */}
      {(message || deleteId) && (
        <NotificationBox
          message={message}
          deleteId={deleteId}
          onClose={() => { setMessage(null); setDeleteId(null); }}
          onConfirmDelete={handleDelete}
        />
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <EditVideoModal
          video={editingVideo}
          onUpdate={handleUpdate}
          onClose={() => setEditingVideo(null)}
          onMessage={setMessage}
        />
      )}

      {/* Add form here (Pass setMessage as onMessage) */}
      <AddVideoForm onAdd={handleAddVideo} onMessage={setMessage} />

      {loading ? (
        <p className="text-gray-600 italic mt-8">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-600 italic mt-8">No videos found. Use the form above to add one!</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-200 mt-8">
          <table className="min-w-full text-sm text-left bg-white">
            <thead className="bg-[#111827] text-white uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">YouTube URL</th>
                <th className="px-6 py-3">Muscle</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr key={video._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{video.title}</td>
                  <td className="px-6 py-3 text-blue-600 hover:underline">
                    <a href={video.videoUrl || `https://youtu.be/${video.videoId}`} target="_blank" rel="noopener noreferrer" className="truncate max-w-[200px] block">
                      {video.videoUrl || video.videoId}
                    </a>
                  </td>
                  <td className="px-6 py-3 capitalize">{video.muscle}</td>
                  <td className="px-6 py-3 capitalize">{video.gender}</td>
                  <td className="px-6 py-3 flex gap-4 justify-center">
                    <button
                      onClick={() => confirmDelete(video._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEditClick(video)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-100"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-9-6l9 9m-4-1l-5 5-1 1-2 2"></path>
                      </svg>
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

// --- Custom Notification/Modal Component (UPDATED with Blur and Dark BG) ---
const NotificationBox = ({ message, deleteId, onClose, onConfirmDelete }) => {
  const isError = message && (message.includes('failed') || message.includes('Error'));
  const isConfirmingDelete = deleteId !== null;

  if (!message && !isConfirmingDelete) return null;

  const boxClasses = isConfirmingDelete
    ? "bg-white border border-gray-300"
    : isError
      ? "bg-red-50 border border-red-300 text-red-800"
      : "bg-green-50 border border-green-300 text-green-800";

  const iconColor = isConfirmingDelete ? "text-red-500" : isError ? "text-red-500" : "text-green-500";
  const title = isConfirmingDelete ? "Confirm Deletion" : isError ? "Operation Failed" : "Success";

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      style={{ backdropFilter: 'blur(4px)' }} // Explicit style for maximum compatibility
    >
      <div className={`p-6 rounded-xl shadow-2xl max-w-sm w-full transition-all duration-300 transform scale-100 ${boxClasses}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isConfirmingDelete ? (
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            ) : isError ? (
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ) : (
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            )}
          </div>
          <div className="ml-3 w-full">
            <h4 className="text-lg font-bold mb-2">{title}</h4>
            <p className={`text-sm ${isConfirmingDelete ? 'text-gray-700' : 'text-current'}`}>
              {isConfirmingDelete
                ? "Are you sure you want to permanently delete this video? This action cannot be undone."
                : message}
            </p>

            <div className="mt-4 flex justify-end space-x-3">
              {isConfirmingDelete ? (
                <>
                  <button
                    onClick={onClose}
                    className="py-2 px-4 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirmDelete}
                    className="py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className={`py-2 px-4 text-sm font-medium rounded-lg shadow-md ${isError ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageVideos;
