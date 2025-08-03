import React, { useEffect, useState, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const profileRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUsername(localStorage.getItem("username") || "Admin");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!profileRef.current?.contains(e.target)) setOpenMenu(false);
      if (!notificationRef.current?.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications/refund-requests");
      const data = res.data.requests || [];
      const noti = data
        .filter((r) => r.trang_thai === "Chờ duyệt hoàn vé")
        .map((r) => ({
          _id: r.ma_dat_ve,
          loai: "yeu_cau_hoan_ve",
          ma_dat_ve: r.ma_dat_ve,
          ma_khach_hang: r.ma_khach_hang,
          ngay_tao: r.ngay_yeu_cau_hoan || r.ngay_dat,
          noi_dung: `Khách hàng ${r.ma_khach_hang} yêu cầu hoàn vé ${r.ma_dat_ve}`,
          trang_thai: r.admin_xem ? "Đã xem" : "Chưa xem",
          gia_ve: r.gia_ve_hoan || 0,
        }))
        .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao));
      setNotifications(noti.slice(0, 10));
      setUnreadCount(noti.filter((n) => n.trang_thai === "Chưa xem").length);
    } catch (e) {
      console.error("Lỗi fetch notifications:", e);
    }
  };

  const markAsRead = async (maDatVe) => {
    try {
      await axios.patch(`http://localhost:8000/api/dat-ve/${maDatVe}/mark-read`);
      fetchNotifications();
    } catch (e) {
      console.error("Lỗi mark as read:", e);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setOpenMenu(false);
    navigate("/profile");
  };

  const formatTime = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "Vừa xong";
    if (min < 60) return `${min} phút trước`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const getNotificationIcon = () => (
    <ReceiptIcon className="text-yellow-600" />
  );

  return (
    <div className="w-full h-16 bg-[#EAF6FF] border-b border-[#C8E0F4] flex items-center justify-between px-4 shadow-sm">
      <span className="font-bold text-xl tracking-tight select-none text-[#0A2540]">
        Admin Dashboard
      </span>

      {isLoggedIn && (
        <div className="flex items-center space-x-4">
          {/* Thông báo */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="p-2 rounded-full relative hover:bg-[#d5eaf7] transition-colors"
            >
              <NotificationsIcon style={{ color: "#0A2540" }} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-96 bg-white border border-[#C8E0F4] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto animate-fade-in">
                <div className="p-3 border-b border-[#EAF6FF] flex justify-between items-center">
                  <h3 className="font-semibold text-[#0A2540]">
                    Yêu cầu hoàn vé ({unreadCount} mới)
                  </h3>
                  <Link
                    to="/xu-ly-hoan-ve"
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => setShowNotifications(false)}
                  >
                    Xem tất cả
                  </Link>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    <ReceiptIcon
                      className="mx-auto mb-2 text-gray-300"
                      sx={{ fontSize: 32 }}
                    />
                    Không có yêu cầu mới
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3 border-b border-[#F0F8FF] hover:bg-[#F4FBFF] cursor-pointer transition-colors ${
                        n.trang_thai === "Chưa xem"
                          ? "bg-[#E1F0FB] border-l-4 border-blue-400"
                          : ""
                      }`}
                      onClick={() => {
                        if (n.trang_thai === "Chưa xem") markAsRead(n.ma_dat_ve);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex space-x-3">
                        <div>{getNotificationIcon()}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#0A2540]">
                            Hoàn vé #{n.ma_dat_ve}
                          </p>
                          <p className="text-xs text-gray-600">{n.noi_dung}</p>
                          <div className="flex justify-between mt-2 text-xs text-gray-400">
                            <span>{formatTime(n.ngay_tao)}</span>
                            <span>{formatCurrency(n.gia_ve)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Avatar + Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpenMenu((v) => !v)}
              className="flex items-center space-x-2 px-2 py-1 rounded-full hover:bg-[#d5eaf7] transition"
            >
              <div className="w-9 h-9 rounded-full bg-[#B4D8F0] flex items-center justify-center">
                <AccountCircleIcon style={{ color: "#0A2540" }} fontSize="large" />
              </div>
              <span className="text-base font-medium text-[#0A2540]">
                {username}
              </span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  openMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="#0A2540"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#C8E0F4] rounded-lg shadow-lg z-50">
                <button
                  onClick={handleProfile}
                  className="w-full text-left px-4 py-3 hover:bg-[#F4FBFF] text-[#0A2540] font-medium rounded-t-lg transition"
                >
                  Thông tin cá nhân
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-[#F4FBFF] text-red-600 font-medium rounded-b-lg transition"
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
