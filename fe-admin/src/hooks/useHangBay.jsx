import { useState, useEffect } from "react";
import axios from "axios";

export const useHangBay = () => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ma_hang_bay: "",
    ten_hang_bay: "",
    iata_code: "",
    quoc_gia: "",
  });

  // 🔹 Thêm state animation
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Fetch data
  const fetchData = () => {
    axios
      .get("http://localhost:8080/hangbay")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setData([]);
        setMessage("Không lấy được dữ liệu hãng bay.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({
      ma_hang_bay: "",
      ten_hang_bay: "",
      iata_code: "",
      quoc_gia: "",
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setIsOpening(true);
    setTimeout(() => setIsOpening(false), 300);
  };

  const handleEdit = (hangbay) => {
    setFormData({ ...hangbay });
    setIsEdit(true);
    setEditingId(hangbay.ma_hang_bay);
    setShowForm(true);
    setMessage("");
    setIsOpening(true);
    setTimeout(() => setIsOpening(false), 300);
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/hangbay", formData)
      .then(() => {
        fetchData();
        handleCancel();
        setMessage("✅ Đã thêm hãng bay mới!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Thêm hãng bay thất bại!");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/hangbay/${editingId}`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        fetchData();
        handleCancel();
        setMessage("✅ Cập nhật hãng bay thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Cập nhật thất bại!");
      });
  };

  const handleDelete = (ma_hang_bay) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hãng bay này?")) return;
    axios
      .delete(`http://localhost:8080/hangbay/${ma_hang_bay}`)
      .then(() => {
        fetchData();
        setMessage("🗑️ Xóa thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Xóa thất bại!");
      });
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      setIsClosing(false);
      setMessage("");
      setFormData({
        ma_hang_bay: "",
        ten_hang_bay: "",
        iata_code: "",
        quoc_gia: "",
      });
    }, 300);
  };

  return {
    data,
    message,
    showForm,
    isEdit,
    formData,
    isClosing,
    isOpening,
    handleChange,
    openAddForm,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
};
