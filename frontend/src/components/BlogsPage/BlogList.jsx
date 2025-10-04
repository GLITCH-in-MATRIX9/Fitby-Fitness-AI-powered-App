import React, { useEffect, useState, useRef, useContext } from "react";
import { AiOutlineUser, AiOutlineCalendar, AiOutlineEdit } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import blogBg from "../../assets/blogsbackground.jpg"; // background image for CTA

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("https://fitby-fitness-ai-powered-app.onrender.com/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!modalRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = modalRef.current;
      const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(percent);
    };
    if (modalRef.current) {
      modalRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedBlog]);

  if (blogs.length === 0)
    return <p className="p-6 text-center text-gray-500">No blogs available.</p>;

  const featured = blogs[0];
  const picks = blogs.slice(1);

  // Unique tags
  const allTags = [
    "All",
    ...new Set(
      blogs.flatMap((blog) => (Array.isArray(blog.tags) ? blog.tags : []))
    ),
  ];

  const filteredBlogs = picks.filter((b) => {
    const matchesTag =
      selectedTag === "All" || (Array.isArray(b.tags) && b.tags.includes(selectedTag));
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const goToWriter = () => {
    if (!user) navigate("/login");
    else navigate("/profile/blogs");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white">
      {/* Modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-white max-w-3xl w-full h-[90vh] overflow-hidden rounded-lg shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute top-0 left-0 h-1 bg-green-500"
              style={{ width: `${scrollProgress}%` }}
            />
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-2 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <div
              ref={modalRef}
              className="h-full overflow-y-scroll px-6 pt-10 pb-6"
              style={{ scrollbarWidth: "none" }}
            >
              <h2 className="text-2xl font-bold mb-4">{selectedBlog.title}</h2>
              <img
                src={
                  selectedBlog.headerImage.startsWith("http")
                    ? selectedBlog.headerImage
                    : `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${selectedBlog.headerImage}`
                }
                alt={selectedBlog.title}
                className="w-full h-60 object-cover rounded mb-2"
              />
              <div className="text-sm text-gray-500 mb-4">
                Written by{" "}
                <span className="font-semibold">{selectedBlog.author || "Unknown"}</span>{" "}
                on {new Date(selectedBlog.publishedAt).toDateString()}
              </div>
              <div
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-4xl shadow-sm focus:outline-none focus:border-[#ed6126]"
        />
      </div>

      {/* Tag Filter */}
      <div className="mb-8">
        <label className="block mb-2 text-gray-700 font-medium">Filter by Tag:</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1 rounded-full border ${selectedTag === tag
                  ? "bg-[#ed6126] text-white border-[#ed6126]"
                  : "bg-white text-gray-700 border-gray-300"
                } hover:bg-[#ed6126] hover:text-white transition`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Blog and Picks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Featured */}
        <div className="lg:col-span-2">
          <div
            className="rounded-xl overflow-hidden shadow-md cursor-pointer"
            onClick={() => setSelectedBlog(featured)}
          >
            <img
              src={
                featured.headerImage.startsWith("http")
                  ? featured.headerImage
                  : `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${featured.headerImage}`
              }
              alt={featured.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-6">
              <p className="text-sm text-[#4A90E2] font-semibold uppercase">
                {featured.tags?.[0] || "General"}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{featured.title}</h2>
              <div className="text-sm text-gray-500 flex gap-4 items-center">
                <span className="flex items-center gap-1">
                  <AiOutlineUser /> {featured.author || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <AiOutlineCalendar />{" "}
                  {new Date(featured.publishedAt).toDateString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedBlog(featured)}
                className="mt-4 inline-block bg-[#ed6126] text-white px-4 py-2 rounded hover:bg-black"
              >
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Write Blog CTA (on top of Best Picks) */}
          <div
            className="relative rounded-xl overflow-hidden shadow-md mb-6 bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${blogBg})` }}
            onClick={goToWriter}
          >
            <div className="absolute inset-0 " />
            <div className="relative z-10 p-6 text-center flex flex-col items-center gap-3">
              <AiOutlineEdit size={24} className="text-white" />
              <h4 className="text-white font-semibold text-lg">
                Share Your Story, Inspire Others
              </h4>
              <p className="text-gray-100 text-sm max-w-xs">
                Write your own blogs or share your journey and get featured.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToWriter();
                }}
                className="mt-1 px-5 py-2 bg-white text-[#ed6126] font-semibold rounded-full hover:bg-[#ed6126] hover:text-white transition"
              >
                Write Your Blog
              </button>
            </div>
          </div>

          {/* Best Picks */}
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Best Picks of the Day
          </h3>
          <ul className="space-y-3">
            {filteredBlogs.slice(0, 3).map((blog) => (
              <li
                key={blog._id}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <p className="text-xs text-[#4A90E2] font-semibold uppercase">
                  {blog.tags?.[0] || "General"}
                </p>
                <h4 className="text-sm font-medium text-gray-800 leading-snug">
                  {blog.title}
                </h4>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {filteredBlogs.slice(0, 6).map((blog) => (
          <div
            key={blog._id}
            className="bg-white shadow rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedBlog(blog)}
          >
            <img
              src={
                blog.headerImage.startsWith("http")
                  ? blog.headerImage
                  : `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${blog.headerImage}`
              }
              alt={blog.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-4">
              <p className="text-xs text-[#4A90E2] font-semibold uppercase">
                {blog.tags?.[0] || "General"}
              </p>
              <h5 className="text-md font-bold text-gray-800 leading-tight">
                {blog.title}
              </h5>
              <div className="text-xs text-gray-500 flex gap-4 mt-2">
                <span className="flex items-center gap-1">
                  <AiOutlineUser size={14} /> {blog.author || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <AiOutlineCalendar size={14} />{" "}
                  {new Date(blog.publishedAt).toDateString()}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlog(blog);
                }}
                className="mt-3 inline-block bg-[#ed6126] text-white px-3 py-1 rounded hover:bg-black text-xs"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
