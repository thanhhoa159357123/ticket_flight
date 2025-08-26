import { useEffect, useState } from "react";
import axios from "axios";

const useGiaVe = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [formData, setFormData] = useState({
    ma_ve: "",
    gia_ve: "",
    ma_hang_ve: "",
    ma_chuyen_bay: "",
    ma_hang_ban_ve: "",
  });

  // Load danh sách
  const fetchData = () => {
    axios
      .get("http://localhost:8080/ve")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setData([]);
        setMessage("Không thể tải danh sách giá vé.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddForm = () => {
    setIsClosing(false); // 🔹 Reset trạng thái đóng khi mở
    setFormData({
      ma_ve: "",
      gia_ve: "",
      ma_hang_ve: "",
      ma_chuyen_bay: "",
      ma_hang_ban_ve: "",
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setIsOpening(true);
    setTimeout(() => setIsOpening(false), 200);
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setIsEdit(true);
    setEditingId(item.ma_ve);
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      setMessage("");
      setIsClosing(false); // 🔹 RESET LẠI isClosing SAU KHI ĐÓNG
    }, 200);
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/ve", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("Đã thêm giá vé mới.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Thêm thất bại.");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/ve/${editingId}`, formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("Cập nhật thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Cập nhật thất bại.");
      });
  };

  const handleDelete = (ma_ve) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giá vé này?")) return;
    axios
      .delete(`http://localhost:8080/ve/${ma_ve}`)
      .then(() => {
        fetchData();
        setMessage("Xóa thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Xóa thất bại.");
      });
  };

  return {
    data,
    showForm,
    isEdit,
    formData,
    message,
    isClosing,
    isOpening,
    setMessage,
    handleChange,
    openAddForm,
    handleEdit,
    handleCancel,
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};

export default useGiaVe;
