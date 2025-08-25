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

  // Fetch data
  const fetchData = () => {
    axios
      .get("http://localhost:8080/hangbay")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
      })
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
  };

  const handleEdit = (hangbay) => {
    setFormData({ ...hangbay });
    setIsEdit(true);
    setEditingId(hangbay.ma_hang_bay);
    setShowForm(true);
    setMessage("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/hangbay", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("Đã thêm hãng bay mới!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Thêm hãng bay thất bại!");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/hangbay/${editingId}`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("Cập nhật hãng bay thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Chỉnh sửa thất bại. Vui lòng thử lại.");
      });
  };

  const handleDelete = (ma_hang_bay) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hãng bay này?")) return;
    axios
      .delete(`http://localhost:8080/hangbay/${ma_hang_bay}`)
      .then(() => {
        fetchData();
        setMessage("Xóa thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Xóa thất bại. Vui lòng thử lại.");
      });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setEditingId(null);
    setFormData({
      ma_hang_bay: "",
      ten_hang_bay: "",
      iata_code: "",
      quoc_gia: "",
    });
    setMessage("");
  };

  return {
    data,
    message,
    showForm,
    isEdit,
    formData,
    handleChange,
    openAddForm,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleCancel,
  };
};
