// utils/format.js
export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(price);

export const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
