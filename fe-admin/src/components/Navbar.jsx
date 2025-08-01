import React, { useState, useEffect, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    
    // Set interval để cập nhật notifications mỗi 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔧 SỬA: Lấy notifications từ refund requests
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/notifications/refund-requests");
      const refundRequests = response.data.requests || [];
      
      // 🔧 Chuyển đổi refund requests thành notifications format
      const notificationData = refundRequests
        .filter(request => request.trang_thai === "Chờ duyệt hoàn vé") // Chỉ lấy requests chờ duyệt
        .map(request => ({
          _id: request.ma_dat_ve,
          loai: "yeu_cau_hoan_ve",
          ma_dat_ve: request.ma_dat_ve,
          ma_khach_hang: request.ma_khach_hang,
          ngay_tao: request.ngay_yeu_cau_hoan || request.ngay_dat,
          noi_dung: `Khách hàng ${request.ma_khach_hang} yêu cầu hoàn vé ${request.ma_dat_ve}`,
          trang_thai: request.admin_xem === false ? "Chưa xem" : "Đã xem", // Dựa vào admin_xem
          hang_ve: request.ma_hang_ve_di,
          gia_ve: request.gia_ve_hoan || 0
        }))
        .sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao)); // Sort by date desc
      
      setNotifications(notificationData.slice(0, 10)); // Chỉ lấy 10 notifications mới nhất
      setUnreadCount(notificationData.filter(n => n.trang_thai === "Chưa xem").length);
      
      console.log('✅ Fetched notifications:', {
        total: refundRequests.length,
        pending: notificationData.length,
        unread: notificationData.filter(n => n.trang_thai === "Chưa xem").length
      });
      
    } catch (error) {
      console.error("❌ Lỗi fetch notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // 🔧 SỬA: Mark as read - update admin_xem field
  const markAsRead = async (maDatVe) => {
    try {
      // Cập nhật admin_xem = true trong dat_ve collection
      await axios.patch(`http://localhost:8000/api/dat-ve/${maDatVe}/mark-read`);
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("❌ Lỗi mark as read:", error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    return `${diffInDays} ngày trước`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "yeu_cau_hoan_ve":
        return <ReceiptIcon className="text-yellow-600" />;
      case "duyet_hoan_ve":
        return <PersonIcon className="text-green-600" />;
      case "tu_choi_hoan_ve":
        return <PersonIcon className="text-red-600" />;
      default:
        return <AccessTimeIcon className="text-blue-600" />;
    }
  };

  // 🔧 Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="w-full h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      {/* Title */}
      <span className="text-xl font-semibold text-gray-800">Admin Dashboard</span>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full relative hover:bg-gray-100 transition-colors"
          >
            <NotificationsIcon className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs min-w-4 h-4 flex items-center justify-center rounded-full px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">
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
                  <ReceiptIcon className="mx-auto mb-2 text-gray-300" sx={{ fontSize: 32 }} />
                  <p>Không có yêu cầu hoàn vé mới</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        notification.trang_thai === "Chưa xem" ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                      onClick={() => {
                        if (notification.trang_thai === "Chưa xem") {
                          markAsRead(notification.ma_dat_ve);
                        }
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.loai)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-800 font-medium">
                              Yêu cầu hoàn vé #{notification.ma_dat_ve}
                            </p>
                            {notification.trang_thai === "Chưa xem" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.noi_dung}
                          </p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.ngay_tao)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatCurrency(notification.gia_ve)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
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
