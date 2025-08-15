import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 
import blogBg from "../../assets/blogsbackground.jpg";

const WriteBlogs = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/profile/blogs");
    }
  };

  return (
    <div className="p-6">
      <div
        className="relative max-w-7xl mx-auto rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 border border-gray-200 bg-cover bg-center"
        style={{
          backgroundImage: `url(${blogBg})`,
        }}
      >

        {/* Content */}
        <div className="relative z-10 p-6 rounded-2xl w-full">
          <h2 className="text-2xl font-bold text-white">
            Share Your Story, Inspire the World
          </h2>
          <p className="text-gray-200 max-w-md mx-auto">
            Write your own blogs or share your journey with us and get featured.
          </p>
          <button
            onClick={handleClick}
            className="mt-4 px-6 py-3 bg-white text-[#ed6126] font-semibold rounded-full hover:bg-[#ffbda1] hover:text-white transition hover:cursor-pointer"
          >
            Write Your Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteBlogs;
