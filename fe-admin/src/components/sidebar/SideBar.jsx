import React from "react";
import { Link } from "react-router-dom";
import FlightIcon from "@mui/icons-material/Flight";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GroupsIcon from "@mui/icons-material/Groups";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import ClassIcon from "@mui/icons-material/Class";
import BusinessIcon from "@mui/icons-material/Business";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';

const menuItems = [
  { label: "Trang chủ", icon: <MenuIcon />, path: "/" },
  { label: "Hãng bay", icon: <AirplanemodeActiveIcon />, path: "/hang-bay" },
  { label: "Hãng bán vé", icon: <BusinessIcon />, path: "/hang-ban-ve" },
  { label: "Khách hàng", icon: <GroupsIcon />, path: "/khach-hang" },
  { label: "Sân bay", icon: <LocationOnIcon />, path: "/san-bay" },
  { label: "Tuyến bay", icon: <AltRouteIcon />, path: "/tuyen-bay" },
  { label: "Chuyến bay", icon: <FlightIcon />, path: "/chuyen-bay" },
  { label: "Hạng vé", icon: <ClassIcon />, path: "/hang-ve" },
  {label : "Vé", icon: <FlightTakeoffIcon />, path : "/ve"},
  { label: "Đặt vé", icon: <AssignmentIcon />, path: "dat-ve" },
  { label: "Xử lý hoàn vé", icon: <AssignmentReturnIcon />, path: "/xu-ly-hoan-ve" }
  // {
  //   label: "Chi tiết vé đặt",
  //   icon: <DescriptionIcon />,
  //   path: "#",
  // },
  // { label: "Hành khách", icon: <PersonIcon />, path: "#" },
  // { label: "Hóa đơn", icon: <ReceiptIcon />, path: "#" },
];

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-[#0A2540] flex flex-col">
      {/* Header Sidebar */}
      <Link
        to="/"
        className="flex items-center p-5 pb-4 border-b border-white/10"
      >
        <MenuIcon className="text-white text-2xl mr-3" />
        <span className="text-white font-bold text-xl tracking-wide">FlyNow</span>
      </Link>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center py-3 px-4 mx-2 rounded-lg transition-all duration-200 cursor-pointer
      hover:bg-white/10 hover:text-white text-gray-300"
          >
            <span className="text-white mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-white/10 bg-[#0A2540]">
        <div className="flex items-center p-2 rounded-lg bg-white/10">
          <AdminPanelSettingsIcon className="text-white mr-3" />
          <span className="text-white font-medium">Admin Panel</span>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
