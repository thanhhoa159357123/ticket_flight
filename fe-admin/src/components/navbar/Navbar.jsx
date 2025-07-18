import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUsername(localStorage.getItem("username") || "");
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  const handleProfile = () => {
    setOpenMenu(false);
    navigate("/profile"); // Đường dẫn trang thông tin cá nhân
  };

  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      {/* Logo/Title */}
      <span className="font-bold text-blue-700 text-xl tracking-tight select-none">
        Flight Admin
      </span>

      {isLoggedIn && (
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <button className="p-2 rounded-full relative hover:bg-gray-100 transition-colors">
            <NotificationsIcon className="text-gray-500" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {/* Avatar & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => setOpenMenu((v) => !v)}
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <AccountCircleIcon className="text-blue-600" fontSize="large" />
              </div>
              <span className="text-base font-medium text-gray-700">{username || "Admin"}</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${openMenu ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Dropdown menu */}
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700 font-medium rounded-t-lg transition"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-medium rounded-b-lg transition"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
