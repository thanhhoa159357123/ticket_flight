import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/khachhang";

export const useKhachHang = () => {
  const [khachHangs, setKhachHangs] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // 🔹 Thêm state animation
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    fetchKhachHangs();
  }, []);

  const fetchKhachHangs = async () => {
    try {
      const res = await axios.get(API_URL);
      setKhachHangs(res.data);
    } catch {
      setMessage("Không thể lấy dữ liệu khách hàng.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setSearchResult(null);
    try {
      const res = await axios.get(`${API_URL}/${searchId}`);
      setSearchResult(res.data);
    } catch {
      setMessage("Không tìm thấy khách hàng với mã đã nhập.");
    }
  };

  const handleDelete = async (ma_khach_hang) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`${API_URL}/${ma_khach_hang}`);
      fetchKhachHangs();
      setMessage("✅ Xóa thành công.");
    } catch {
      setMessage("❌ Xóa thất bại.");
    }
  };

  const toggleSearchForm = () => {
    setShowSearch(true);
    setSearchId("");
    setSearchResult(null);
    setMessage("");
    setIsOpening(true);
    setTimeout(() => setIsOpening(false), 300);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSearch(false);
      setSearchId("");
      setSearchResult(null);
      setIsClosing(false);
      setMessage("");
    }, 300);
  };

  return {
    khachHangs,
    searchId,
    setSearchId,
    searchResult,
    message,
    showSearch,
    isClosing,
    isOpening,
    handleSearch,
    handleDelete,
    toggleSearchForm,
    handleCancel,
  };
};

export default useKhachHang;
