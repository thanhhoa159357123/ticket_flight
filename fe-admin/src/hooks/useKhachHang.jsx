// hooks/useKhachHang.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/khachhang";

export const useKhachHang = () => {
  const [khachHangs, setKhachHangs] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [message, setMessage] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchKhachHangs();
  }, []);

  const fetchKhachHangs = async () => {
    try {
      const res = await axios.get(API_URL);
      setKhachHangs(res.data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setMessage("Không tìm thấy khách hàng với mã đã nhập.");
    }
  };

  const handleDelete = async (ma_khach_hang) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await axios.delete(`${API_URL}/${ma_khach_hang}`);
      fetchKhachHangs();
      setMessage("Xóa thành công.");
    } catch (err) {
      console.error(err);
      setMessage("Xóa thất bại.");
    }
  };

  const toggleSearchForm = () => {
    setShowSearch(true);
    setSearchId("");
    setSearchResult(null);
    setMessage("");
  };

  const handleCancel = () => {
    setShowSearch(false);
    setSearchId("");
    setSearchResult(null);
    setMessage("");
  };

  return {
    khachHangs,
    searchId,
    setSearchId,
    searchResult,
    message,
    showSearch,
    handleSearch,
    handleDelete,
    toggleSearchForm,
    handleCancel,
  };
};
export default useKhachHang;