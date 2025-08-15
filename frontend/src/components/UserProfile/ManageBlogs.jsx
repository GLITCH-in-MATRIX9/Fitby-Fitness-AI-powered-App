import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FaPlusCircle,
  FaTrash,
  FaEdit,
  FaEye,
  FaRegFileAlt,
  FaSave,
} from "react-icons/fa";
import LexicalEditor from "./LexicalEditor";

const ManageBlogs = () => {
  const { user, token } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    imageFile: null,
  });
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  // Fetch user's blogs
  useEffect(() => {
    if (!user?.id || !token) return;
    fetch(`https://fitby-fitness-ai-powered-app.onrender.com/api/blogs/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch error:", err));
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "imageFile" ? files[0] : value,
    }));
  };

  const handleCreate = () => {
    if (!form.title || !form.content)
      return alert("Title and content required.");

    setSaving(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("tags", form.tags);
    if (form.imageFile) formData.append("headerImage", form.imageFile);

    const url = editingId
      ? `https://fitby-fitness-ai-powered-app.onrender.com/api/blogs/${editingId}`
      : "https://fitby-fitness-ai-powered-app.onrender.com/api/blogs";

    fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data._id) {
          setBlogs((prev) =>
            editingId
              ? prev.map((b) => (b._id === editingId ? data : b))
              : [data, ...prev]
          );
          setForm({ title: "", content: "", tags: "", imageFile: null });
          setEditingId(null);
        } else {
          alert(data.message || "Failed to save blog.");
        }
      })
      .catch((err) => {
        console.error("Save error:", err);
        alert("Failed to save blog.");
      })
      .finally(() => setSaving(false));
  };

  const handleEdit = (blog) => {
    console.log("EDIT content →", blog.content); // ⬅️ ADD THIS LINE
    setEditingId(blog._id);
    setForm({
      title: blog.title,
      content: blog.content,
      tags: blog.tags.join(", "),
      imageFile: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleCancel = () => {
    setEditingId(null);
    setForm({ title: "", content: "", tags: "", imageFile: null });
  };

  const handleDelete = (id) => {
    fetch(`https://fitby-fitness-ai-powered-app.onrender.com/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => setBlogs((prev) => prev.filter((b) => b._id !== id)))
      .catch((err) => console.error("Delete error:", err));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">
        {editingId ? "Edit Blog" : "Manage Your Blogs"}
      </h2>

      {/* Blog Form */}
      <div
        ref={formRef}
        className="bg-white p-4 rounded-xl shadow mb-6 space-y-3"
      >
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FaRegFileAlt /> {editingId ? "Update Blog" : "Create New Blog"}
        </h3>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <LexicalEditor
          key={editingId || "new"}
          value={form.content}
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
        />

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={handleCreate}
            disabled={saving}
            className={`${editingId
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
              } text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              "Saving..."
            ) : editingId ? (
              <>
                <FaSave /> Update Blog
              </>
            ) : (
              <>
                <FaPlusCircle /> Post Blog
              </>
            )}
          </button>

          {editingId && (
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Blog List */}
      <div className="grid gap-4">
        {!blogs.length ? (
          <p className="text-gray-500">No blogs created yet.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white flex flex-col md:flex-row shadow rounded-xl overflow-hidden"
            >
              {blog.headerImage && (
                <img
                  src={`https://fitby-fitness-ai-powered-app.onrender.com/uploads/${blog.headerImage}`}
                  alt={blog.title}
                  className="w-full md:w-1/3 h-48 object-cover"
                />
              )}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-lg font-semibold">{blog.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(blog.publishedAt).toLocaleDateString()} |{" "}
                    {blog.tags?.join(", ")}
                  </p>
                  <p
                    className="text-sm text-gray-700 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(0, 150) + "...",
                    }}
                  ></p>
                </div>
                <div className="flex gap-4 mt-4 text-gray-600 text-lg">
                  <button title="View">
                    <FaEye />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => handleEdit(blog)}
                    className="text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => handleDelete(blog._id)}
                    className="text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBlogs;
