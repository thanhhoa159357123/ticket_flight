// hooks/useHangVe.js
import { useState, useEffect } from "react";
import axios from "axios";

const initialForm = {
  ma_hang_ve: "",
  ten_hang_ve: "",
  so_kg_hanh_ly_ky_gui: "",
  so_kg_hanh_ly_xach_tay: "",
  so_do_ghe: "",
  khoang_cach_ghe: "",
  refundable: "",
  changeable: "",
};

export const useHangVe = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchData = () => {
    axios
      .get("http://localhost:8080/hangve")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setData([]);
        setMessage("Không thể lấy dữ liệu hạng vé.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData(initialForm);
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (hangVe) => {
    setFormData({ ...hangVe });
    setIsEdit(true);
    setEditingId(hangVe.ma_hang_ve);
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEdit(false);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/hangve", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("✅ Thêm hạng vé thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Thêm thất bại!");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/hangve/${editingId}`, formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("✅ Cập nhật thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Cập nhật thất bại!");
      });
  };

  const handleDelete = (ma_hang_ve) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa hạng vé này?")) return;
    axios
      .delete(`http://localhost:8080/hangve/${ma_hang_ve}`)
      .then(() => {
        fetchData();
        setMessage("🗑️ Đã xóa thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "❌ Xóa thất bại!");
      });
  };

  return {
    data,
    formData,
    showForm,
    isEdit,
    message,
    handleChange,
    openAddForm,
    handleEdit,
    handleCancel,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};
