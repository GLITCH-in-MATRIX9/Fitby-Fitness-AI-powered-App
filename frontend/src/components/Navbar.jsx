import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo1 from "../assets/logo.png";
import logo2 from "../assets/FITBY.png";
import { FaFire, FaBars, FaTimes } from "react-icons/fa";
import { AiOutlineFire } from "react-icons/ai"; // Imported for outline style
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleSetStreak = () => {
    console.log("Streak setter button clicked!");
    // Logic to set/update the streak can be added here (e.g., call a backend API)
  };

  const profileImageUrl = user?.image
    ? `https://fitby-fitness-ai-powered-app.onrender.com/uploads/${user.image}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-8xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo1} alt="Logo 1" className="h-12 w-12 object-contain" />
          <img src={logo2} alt="Logo 2" className="h-6 object-contain" />
        </div>

        {/* Hamburger icon */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-[#ed6126] text-2xl"
          >
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-[#626262]">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[#626262] border-b-2 border-[#ed6126] pb-1"
                : "hover:text-[#ed6126] transition duration-200"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              isActive
                ? "text-[#626262] border-b-2 border-[#ed6126] pb-1"
                : "hover:text-[#ed6126] transition duration-200"
            }
          >
            Blogs
          </NavLink>
          <NavLink
            to="/workoutplans"
            className={({ isActive }) =>
              isActive
                ? "text-[#626262] border-b-2 border-[#ed6126] pb-1"
                : "hover:text-[#ed6126] transition duration-200"
            }
          >
            Workout Plans
          </NavLink>
          <NavLink
            to="/personalized-trainer"
            className={({ isActive }) =>
              isActive
                ? "text-[#626262] border-b-2 border-[#ed6126] pb-1"
                : "hover:text-[#ed6126] transition duration-200"
            }
          >
            Personalized Trainer
          </NavLink>
        </div>

        {/* Right section (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 relative">
          
          {/* STREAK SETTER BUTTON (New Element) */}
          <button
            onClick={handleSetStreak}
            className="text-[#ed6126] border border-[#ed6126] w-8 h-8 rounded-full flex items-center justify-center p-1 hover:bg-[#ed6126] hover:text-white transition duration-200"
            title="Set Daily Streak"
          >
            {/* Using AiOutlineFire for the desired empty border effect */}
            <AiOutlineFire size={18} />
          </button>

          {/* User Streak Display (Existing Element) */}
          {typeof user?.streak === "number" && (
            <div className="flex items-center gap-1 text-[#ed6126] text-sm font-semibold">
              <FaFire className="text-xl" />
              {user.streak} Day Streak
            </div>
          )}

          {/* Fitby AI Button */}
          <NavLink to="/ai">
            <button className="bg-[#ed6126] text-white px-4 py-2 rounded-md font-semibold hover:bg-black transition duration-200">
              Fitby AI
            </button>
          </NavLink>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="rounded-full overflow-hidden border-2 border-[#ed6126] w-10 h-10 flex items-center justify-center"
              >
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-profile.png";
                  }}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 text-sm text-[#333]">
                  <div className="px-4 py-2 border-b">
                    👋 {user.name?.split(" ")[0] || "User"}
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login">
              <button className="border border-[#ed6126] text-[#ed6126] px-4 py-2 rounded-md font-semibold hover:bg-[#ed6126] hover:text-white transition duration-200">
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMenu && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4 text-sm text-[#626262]">
          <NavLink
            to="/"
            onClick={() => setShowMenu(false)}
            className="block hover:text-[#ed6126]"
          >
            Home
          </NavLink>
          <NavLink
            to="/blogs"
            onClick={() => setShowMenu(false)}
            className="block hover:text-[#ed6126]"
          >
            Blogs
          </NavLink>
          <NavLink
            to="/workoutplans"
            onClick={() => setShowMenu(false)}
            className="block hover:text-[#ed6126]"
          >
            Workout Plans
          </NavLink>
          <NavLink
            to="/personalized-trainer"
            onClick={() => setShowMenu(false)}
            className="block hover:text-[#ed6126]"
          >
            Personalized Trainer
          </NavLink>
          <NavLink
            to="/ai"
            onClick={() => setShowMenu(false)}
            className="block hover:text-[#ed6126]"
          >
            Fitby AI
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setShowMenu(false)}
                className="block hover:text-[#ed6126]"
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="block text-left w-full hover:text-[#ed6126]"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setShowMenu(false)}
              className="block hover:text-[#ed6126]"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;