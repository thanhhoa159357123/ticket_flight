export const getStatusBadge = (status) => {
  const statusMap = {
    // Trạng thái cơ bản
    "Đã hủy": "bg-red-100 text-red-800",
    "Đã thanh toán": "bg-green-100 text-green-800",
    "Chưa thanh toán": "bg-yellow-100 text-yellow-800",
    
    // 🆕 Trạng thái hoàn vé
    "Chờ duyệt hoàn vé": "bg-yellow-100 text-yellow-800",
    "Đã hoàn vé": "bg-blue-100 text-blue-800",
    
    // Default
    default: "bg-gray-100 text-gray-800"
  };
  
  return statusMap[status] || statusMap.default;
};

export const formatVietnameseDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 🆕 Thêm function helper cho trạng thái hoàn vé
export const getRefundStatusText = (status, refundStatus) => {
  if (status === "Đã thanh toán" && refundStatus === "Từ chối") {
    return "Không được hoàn vé";
  }
  return status;
};

// 🆕 Kiểm tra xem vé có thể hoàn không
export const canRefundTicket = (status) => {
  return status === "Đã thanh toán";
};

// 🆕 Kiểm tra xem vé đang trong quá trình hoàn
export const isRefundPending = (status) => {
  return status === "Chờ duyệt hoàn vé";
};

// 🆕 Kiểm tra xem vé đã được hoàn
export const isRefunded = (status) => {
  return status === "Đã hoàn vé";
};