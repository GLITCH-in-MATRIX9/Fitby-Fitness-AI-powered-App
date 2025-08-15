import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaDumbbell, FaHistory, FaCog , FaRegNewspaper} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.split(" ")[0] || "Dashboard";

  return (
    <div className="w-64 bg-white p-6 shadow-md">
      <h2 className="text-2xl font-bold text-[#ed6126] mb-8">
        {firstName}'s Dashboard
      </h2>
      <nav className="flex flex-col space-y-4 text-[#333]">
        <NavLink to="/profile" className="flex items-center gap-2 hover:text-[#ed6126]">
          <FaUser /> Profile Overview
        </NavLink>
        <NavLink to="/profile/goals" className="flex items-center gap-2 hover:text-[#ed6126]">
          <FaDumbbell /> Fitness Challenges
        </NavLink>
        <NavLink to="/profile/history" className="flex items-center gap-2 hover:text-[#ed6126]">
          <FaHistory /> Workout History
        </NavLink>
        <NavLink to="/profile/settings" className="flex items-center gap-2 hover:text-[#ed6126]">
          <FaCog /> Settings
        </NavLink>
        <NavLink to="/profile/blogs" className="flex items-center gap-2 hover:text-[#ed6126]">
  <FaRegNewspaper /> Manage Blogs
</NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
