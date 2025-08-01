// services/TicketOptionalsPanelService.jsx
import axios from "axios";

export const fetchSingleTicketPackage = async (maGiaVe) => {
  if (!maGiaVe) return [];

  const response = await axios.post(
    "http://localhost:8000/api/gia-ve/chi-tiet-gia-ve-nhieu",
    { ma_gia_ves: [maGiaVe] }
  );

  return response.data || [];
};

export const fetchMultipleTicketPackages = async (maGiaVes) => {
  if (!Array.isArray(maGiaVes) || maGiaVes.length === 0) return [];

  const response = await axios.post(
    "http://localhost:8000/api/gia-ve/chi-tiet-gia-ve-nhieu",
    { ma_gia_ves: maGiaVes } // ✅ không bọc thêm []
  );

  return response.data || [];
};

export const createBooking = async (payload) => {
  const response = await axios.post(
    "http://localhost:8000/api/dat-ve",
    payload
  );
  return response.data?.dat_ve; // return object chứa ma_dat_ve
};
