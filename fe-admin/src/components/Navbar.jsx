import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Title */}
      <span></span>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full relative hover:bg-gray-100 transition-colors">
          <NotificationsIcon className="text-gray-500" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center space-x-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <AccountCircleIcon className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
