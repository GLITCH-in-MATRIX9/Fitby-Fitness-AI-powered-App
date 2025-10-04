const User = require("../models/User");
const Blog = require("../models/Blog");
exports.createBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const blog = new Blog({
      title,
      content,
      tags: Array.isArray(tags) ? tags : [], 
      headerImage: req.file ? req.file.filename : "",
      author: user.name,
      userId: user._id,
      publishedAt: new Date(),
    });

    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    console.error("❌ Error in createBlog:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ userId: req.params.userId }).sort({ publishedAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (req.user.id !== blog.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : blog.tags;

    if (req.file) {
      blog.headerImage = req.file.filename;
    }

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: err.message });
  }
};
