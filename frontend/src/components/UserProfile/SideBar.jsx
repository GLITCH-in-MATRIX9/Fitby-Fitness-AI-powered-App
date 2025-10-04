import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaDumbbell, FaHistory, FaCog, FaRegNewspaper } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.split(" ")[0] || "Dashboard";

  const links = [
    { to: "/profile", icon: <FaUser />, label: "Profile Overview", end: true },
    { to: "/profile/goals", icon: <FaDumbbell />, label: "Fitness Challenges" },
    { to: "/profile/history", icon: <FaHistory />, label: "Workout History" },
    { to: "/profile/settings", icon: <FaCog />, label: "Settings" },
    { to: "/profile/blogs", icon: <FaRegNewspaper />, label: "Manage Blogs" },
  ];

  return (
    <div className="flex flex-col items-center md:items-start w-20 md:w-64 bg-white shadow-md py-6 min-h-screen">
      <h2 className="text-[#ed6126] font-bold text-sm md:text-2xl mb-6 md:ml-4 text-center md:text-left">
        {`${firstName}'s Dashboard`}
      </h2>

      <nav className="flex flex-col gap-6 w-full">
        {links.map(({ to, icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end} // fixes "Profile always active" issue
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg w-full hover:text-[#ed6126] ${isActive ? "text-[#ed6126]" : "text-gray-600"
              }`
            }
          >
            <span className="flex justify-center md:justify-start w-8">
              {icon}
            </span>
            <span className="hidden md:inline ml-3">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
