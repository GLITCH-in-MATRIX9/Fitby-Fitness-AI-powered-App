// src/components/AdminPanel/ManageBlogs.js

import React, { useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineFileText,
} from "react-icons/ai";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleSaveBlog = () => {
    if (!title.trim() || !content.trim() || !writer.trim()) return;

    const date = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (isEditing) {
      const updatedBlogs = blogs.map((blog) =>
        blog.id === editId
          ? { ...blog, title, content, writer, date }
          : blog
      );
      setBlogs(updatedBlogs);
      setIsEditing(false);
      setEditId(null);
    } else {
      const newBlog = {
        id: Date.now(),
        title,
        content,
        writer,
        date,
      };
      setBlogs([newBlog, ...blogs]);
    }

    setTitle("");
    setContent("");
    setWriter("");
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setWriter(blog.writer);
    setEditId(blog.id);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleCancelEdit = () => {
    setTitle("");
    setContent("");
    setWriter("");
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <AiOutlineFileText size={28} />
        Blog Management
      </h2>

      {/* Blog Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Blog" : "Add New Blog"}
        </h3>

        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-[#e9632e]"
        />

        <textarea
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 h-32 resize-none focus:outline-[#e9632e]"
        />

        <input
          type="text"
          placeholder="Writer's Name"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-[#e9632e]"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveBlog}
            className="bg-[#e9632e] text-white px-5 py-2 rounded hover:bg-[#d6531f] transition"
          >
            {isEditing ? "Update Blog" : "Add Blog"}
          </button>
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Blog List */}
      <div>
        <h3 className="text-2xl font-semibold mb-4"> Blog List</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-600">No blogs have been added yet.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-5 rounded-lg shadow border"
              >
                <h4 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                  <AiOutlineFileText className="text-[#e9632e]" />
                  {blog.title}
                </h4>

                <p className="text-gray-700 mt-2">{blog.content}</p>

                <div className="text-sm text-gray-500 mt-3 flex flex-wrap gap-4">
                  <span className="flex items-center gap-1">
                    <AiOutlineUser />
                    {blog.writer}
                  </span>
                  <span className="flex items-center gap-1">
                    <AiOutlineCalendar />
                    {blog.date}
                  </span>
                </div>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex items-center text-blue-600 hover:underline gap-1"
                  >
                    <AiOutlineEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="flex items-center text-red-600 hover:underline gap-1"
                  >
                    <AiOutlineDelete /> Delete
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
