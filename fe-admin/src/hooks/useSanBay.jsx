import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/san_bay";

export default function useSanBay() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setData(res.data || []);
    } catch {
      setMessage("Không lấy được dữ liệu sân bay.");
    } finally {
      setLoading(false);
    }
  };

  const addSanBay = async (formData) => {
    try {
      await axios.post(API_URL, formData);
      fetchData();
      setMessage("✅ Thêm sân bay thành công!");
    } catch {
      setMessage("❌ Thêm sân bay thất bại!");
    }
  };

  const updateSanBay = async (id, formData) => {
    try {
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchData();
      setMessage("✅ Cập nhật sân bay thành công!");
    } catch {
      setMessage("❌ Cập nhật sân bay thất bại!");
    }
  };

  const deleteSanBay = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân bay này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
      setMessage("✅ Xóa sân bay thành công.");
    } catch {
      setMessage("❌ Xóa sân bay thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    message,
    loading,
    fetchData,
    addSanBay,
    updateSanBay,
    deleteSanBay,
    setMessage,
  };
}
