import React, { useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Demo: Xử lý đăng nhập/đăng xuất
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Title */}
      <span className="font-bold text-blue-700 text-lg">Flight Admin</span>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <div className="flex items-center space-x-2 pl-2">
            <button
              onClick={handleLogin}
              className="px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition"
            >
              Đăng ký
            </button>
            <button
              onClick={handleLogin}
              className="px-4 py-1 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Đăng nhập
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4 pl-2">
            <button className="p-2 rounded-full relative hover:bg-gray-100 transition-colors">
              <NotificationsIcon className="text-gray-500" />
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <AccountCircleIcon className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
