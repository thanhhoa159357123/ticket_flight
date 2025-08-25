import React from "react";
import { Link } from "react-router-dom";
import FlightIcon from "@mui/icons-material/Flight";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ClassIcon from "@mui/icons-material/Class";
import BusinessIcon from "@mui/icons-material/Business";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn'; // Icon cho hoàn vé

const menuItems = [
  { label: "Hãng bay", icon: <AirplanemodeActiveIcon />, path: "/hang-bay" },
  { label: "Hãng bán vé", icon: <BusinessIcon />, path: "/hang-ban-ve" },
  { label: "Khách hàng", icon: <GroupsIcon />, path: "/khach-hang" },
  { label: "Sân bay", icon: <LocationOnIcon />, path: "/san-bay" },
  { label: "Chuyến bay", icon: <FlightIcon />, path: "/chuyen-bay" },
  { label: "Hạng vé", icon: <ClassIcon />, path: "/hang-ve" },
  { label: "Loại chuyến đi", icon: <FlightTakeoffIcon />, path: "/loai-chuyen-di" },
  { label: "Vé", icon: <MonetizationOnIcon />, path: "/ve" },
  { label: "Xử lý hoàn vé", icon: <AssignmentReturnIcon />, path: "/xu-ly-hoan-ve" }, // 🆕 Menu mới
];

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header Sidebar */}
      <Link
        to="/"
        className="flex items-center p-5 pb-4 border-b border-gray-200"
      >
        <MenuIcon className="text-blue-600 text-2xl mr-3" />
        <span className="text-blue-600 font-bold text-xl">Travelokaa</span>
      </Link>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center py-3 px-4 mx-2 rounded-lg transition-all duration-200 cursor-pointer
      hover:bg-blue-50 hover:text-blue-600 text-gray-600 hover:font-medium"
          >
            <span className="text-blue-500 mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-200 bg-blue-50">
        <div className="flex items-center p-2 rounded-lg bg-white shadow-sm">
          <AdminPanelSettingsIcon className="text-blue-600 mr-3" />
          <span className="text-blue-600 font-medium">Admin Panel</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
