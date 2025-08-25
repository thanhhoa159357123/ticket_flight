import { useEffect, useState } from "react";
import axios from "axios";

const initialFormData = {
  ma_chuyen_bay: "",
  thoi_gian_di: "",
  thoi_gian_den: "",
  ma_hang_bay: "",
  ma_san_bay_di: "",
  ma_san_bay_den: "",
};

export const useChuyenBay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = () => {
    axios
      .get("http://localhost:8080/chuyenbay")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setData([]);
        setMessage("Không lấy được dữ liệu chuyến bay.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData(initialFormData);
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (cb) => {
    setFormData({ ...cb });
    setIsEdit(true);
    setEditingId(cb.ma_chuyen_bay);
    setShowForm(true);
    setMessage("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/chuyenbay", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("Đã thêm chuyến bay mới!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Thêm thất bại!");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/chuyenbay/${editingId}`, formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("Cập nhật thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Cập nhật thất bại.");
      });
  };

  const handleDelete = (ma) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) return;
    axios
      .delete(`http://localhost:8080/chuyenbay/${ma}`)
      .then(() => {
        fetchData();
        setMessage("Xóa thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Xóa thất bại.");
      });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setEditingId(null);
    setFormData(initialFormData);
    setMessage("");
  };

  return {
    data,
    showForm,
    isEdit,
    editingId,
    message,
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
