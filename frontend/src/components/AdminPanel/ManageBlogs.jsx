import React, { useEffect, useState } from "react";

// --- Inline SVG Icons (Replacing react-icons/ai) ---

// Icon for Edit (AiOutlineEdit)
const EditIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
);
// Icon for Delete (AiOutlineDelete)
const DeleteIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
// Icon for User (AiOutlineUser)
const UserIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
// Icon for Calendar (AiOutlineCalendar)
const CalendarIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-4 4h.01M3 21h18a2 2 0 002-2V7a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);
// Icon for File Text (AiOutlineFileText)
const FileTextIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
// --- End Icons ---

const API_URL = "https://fitby-fitness-ai-powered-app.onrender.com/api/blogs";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // For success/error feedback

  // --- Utility Functions ---

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearForm = () => {
    setTitle("");
    setContent("");
    setWriter("");
    setIsEditing(false);
    setEditId(null);
  };

  // --- FETCH BLOGS (C) ---

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (res.ok) {
        // Assuming backend returns an array of blog objects
        setBlogs(data);
      } else {
        setMessage("Failed to load blogs.");
        setBlogs([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage(`Error connecting to backend: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // --- SAVE/UPDATE BLOG (C/U) ---

  const handleSaveBlog = async () => {
    if (!title.trim() || !content.trim() || !writer.trim()) {
      setMessage("Please fill in all fields.");
      return;
    }

    setMessage(null);
    setLoading(true);

    const blogData = { title, content, writer };
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${editId}` : API_URL;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      const data = await res.json();

      if (res.ok) {
        if (isEditing) {
          // Update local state with the returned updated blog (or use local data if backend doesn't return full object)
          setBlogs(blogs.map(blog => blog._id === editId ? data : blog));
          setMessage("Blog updated successfully!");
        } else {
          // Add the new blog to the top of the list
          setBlogs([data, ...blogs]);
          setMessage("Blog added successfully!");
        }
        clearForm();
      } else {
        setMessage(data.error || `Failed to ${isEditing ? 'update' : 'add'} blog.`);
      }

    } catch (error) {
      console.error("Save error:", error);
      setMessage(`Network error: Could not connect to the API.`);
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT BLOG (U) ---
  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setWriter(blog.writer);
    setEditId(blog._id); // Use _id for MongoDB compatibility
    setIsEditing(true);
    setMessage(null);
  };

  // --- DELETE BLOG (D) ---

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setMessage(data.message || "Blog deleted successfully.");
      } else {
        setMessage(data.error || "Failed to delete blog.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage(`Network error during deletion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    clearForm();
    setMessage(null);
  };

  const handleInputClass = "w-full p-3 border border-gray-300 rounded focus:border-[#e9632e] focus:ring-1 focus:ring-[#e9632e] transition";

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <FileTextIcon size={28} className="w-7 h-7 text-[#e9632e]" />
        Blog Management
      </h2>

      {/* Feedback Message */}
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          {message}
        </div>
      )}

      {/* Blog Form */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {isEditing ? "Edit Blog" : "Add New Blog"}
        </h3>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={handleInputClass + " mb-4"}
          disabled={loading}
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={handleInputClass + " mb-4 h-32 resize-none"}
          disabled={loading}
        />

        <input
          type="text"
          placeholder="Writer's Name"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          className={handleInputClass + " mb-4"}
          disabled={loading}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveBlog}
            className="bg-[#e9632e] text-white px-5 py-2 rounded-lg font-medium shadow-md hover:bg-[#d6531f] transition disabled:bg-gray-400"
            disabled={loading}
          >
            {isEditing ? "Update Blog" : "Add Blog"}
          </button>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Blog List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4 text-gray-900"> Blog List</h3>

        {loading && !blogs.length ? (
          <p className="text-gray-600 italic">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-600">No blogs have been added yet.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog._id} // Use _id from backend
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition border border-gray-200"
              >
                <h4 className="text-xl font-bold text-[#111827] flex items-center gap-2 mb-2">
                  <FileTextIcon className="w-5 h-5 text-[#e9632e]" />
                  {blog.title}
                </h4>

                <p className="text-gray-700 text-sm mt-2 line-clamp-3">{blog.content}</p>

                <div className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-4 h-4" />
                    {blog.writer}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {blog.date ? blog.date : formatDate(blog.createdAt)} {/* Use date if provided, otherwise format createdAt */}
                  </span>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition gap-1 font-medium"
                    disabled={loading}
                  >
                    <EditIcon className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="flex items-center text-red-600 hover:text-red-800 transition gap-1 font-medium"
                    disabled={loading}
                  >
                    <DeleteIcon className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
