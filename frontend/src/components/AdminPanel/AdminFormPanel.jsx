import React, { useState } from "react";
import {
  AiOutlineVideoCamera,
} from "react-icons/ai";
import {
  BsInfoCircle,
  BsEye,
  BsCheckCircle,
  BsXCircle,
  BsCloudUpload
} from "react-icons/bs";

const AdminFormPanel = () => {
  const [formData, setFormData] = useState({
    videoId: "",
    gender: "male",
    muscle: "",
    title: "",
  });

  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusType("submitting");
    setStatus("Submitting...");

    try {
      const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Video added successfully!");
        setStatusType("success");
        setFormData({ videoId: "", gender: "male", muscle: "", title: "" });
      } else {
        setStatus("Failed to add video.");
        setStatusType("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error connecting to server.");
      setStatusType("error");
    }
  };

  const renderStatusIcon = () => {
    if (statusType === "success") return <BsCheckCircle className="text-green-600" size={20} />;
    if (statusType === "error") return <BsXCircle className="text-red-600" size={20} />;
    if (statusType === "submitting") return <BsCloudUpload className="text-blue-600 animate-pulse" size={20} />;
    return null;
  };

  return (
    <main className="flex-1 p-10 bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <AiOutlineVideoCamera size={28} className="text-[#e9632e]" />
        <h2 className="text-3xl font-bold text-[#e9632e]">Add New Workout Video</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md"
      >
        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Video Title</label>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Dumbbell Chest Press"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">YouTube Video ID</label>
          <input
            name="videoId"
            type="text"
            value={formData.videoId}
            onChange={handleChange}
            placeholder="e.g., dJLzQbYtLho"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-1">Muscle Group</label>
          <input
            name="muscle"
            type="text"
            value={formData.muscle}
            onChange={handleChange}
            placeholder="e.g., chest, abs, back"
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            className="bg-[#e9632e] hover:bg-black text-white font-semibold py-3 px-6 rounded-lg transition w-full"
          >
            Submit Video
          </button>
        </div>
      </form>

      {/* Status Message */}
      {status && (
        <div className="mt-6 flex justify-center items-center gap-2 text-lg font-medium text-gray-700">
          {renderStatusIcon()}
          <span>{status}</span>
        </div>
      )}

      {/* Placeholder for recent videos */}
      <section className="mt-12">
        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <AiOutlineVideoCamera size={22} />
          <h3 className="text-xl font-semibold">Recently Added Videos</h3>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-gray-600 italic flex items-center gap-2">
          <BsEye size={18} />
          <span>(Coming soon... You’ll see the added videos here.)</span>
        </div>
      </section>
    </main>
  );
};

export default AdminFormPanel;
