// src/pages/Blogs.jsx
import React from "react";
import BlogList from "../components/BlogsPage/BlogList"; 
import WriteBlogs from "../components/BlogsPage/WriteBlogs"

const Blogs = () => {
  return (
    <div>
      <BlogList />
      <WriteBlogs/>
      
    </div>
  );
};

export default Blogs;
