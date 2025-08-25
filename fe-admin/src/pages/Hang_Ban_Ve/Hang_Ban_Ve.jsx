import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";

const Hang_Ban_Ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    ma_hang_ban_ve: "",
    ten_hang_ban_ve: "",
    vai_tro: "",
  });
  const [message, setMessage] = useState("");

  const fetchData = () => {
    axios
      .get("http://localhost:8080/hang_ban_ve")
      .then((res) => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setData([]);
        setMessage("Không lấy được dữ liệu hãng bán vé.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({ ma_hang_ban_ve: "", ten_hang_ban_ve: "", vai_tro: "" });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setIsEdit(true);
    setEditingId(item.ma_hang_ban_ve);
    setShowForm(true);
    setMessage("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/hang_ban_ve", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("Đã thêm hãng bán vé mới!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Thêm thất bại!");
      });
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/hang_ban_ve/${editingId}`, formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("Cập nhật thành công!");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Cập nhật thất bại!");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hãng này?")) return;
    axios
      .delete(`http://localhost:8080/hang_ban_ve/${id}`)
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
    setFormData({ ma_hang_ban_ve: "", ten_hang_ban_ve: "", vai_tro: "" });
    setMessage("");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách hãng bán vé
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
          >
            <FaPlus /> Thêm hãng
          </button>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {showForm && (
          <>
            <div
              className="fixed inset-0 z-40 bg-white bg-opacity-40 backdrop-blur-[8px] transition-all"
              style={{ backdropFilter: "blur(8px)" }}
              onClick={handleCancel}
              aria-label="overlay"
            ></div>

            <div
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-md
                        px-8 py-9 animate-fade-in"
              style={{ minWidth: 340, maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa hãng bán vé" : "Thêm hãng bán vé"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label="close form"
                >
                  <FaTimes className="text-xl text-blue-400" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-6">
                <input
                  name="ma_hang_ban_ve"
                  value={formData.ma_hang_ban_ve}
                  onChange={handleChange}
                  disabled={isEdit}
                  placeholder="Mã hãng bán vé"
                  className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition bg-gray-100"
                />
                <input
                  name="ten_hang_ban_ve"
                  value={formData.ten_hang_ban_ve}
                  onChange={handleChange}
                  placeholder="Tên hãng bán vé"
                  className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
                <input
                  name="vai_tro"
                  value={formData.vai_tro}
                  onChange={handleChange}
                  placeholder="Vai trò"
                  className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                />
              </div>
              <div className="mt-8 flex gap-2">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full ${
                    isEdit
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } py-3 rounded-full text-white font-bold shadow-md transition text-base`}
                >
                  {isEdit ? "Cập nhật" : "Xác nhận thêm"}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full font-bold shadow-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-200 transition text-base"
                >
                  Hủy
                </button>
              </div>
            </div>
          </>
        )}

        <div className={showForm ? "pointer-events-none blur-[2px] select-none" : ""}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Mã hãng</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Tên hãng</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.map((item, idx) => (
                  <tr key={item.ma_hang_ban_ve} className={`transition-all hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"}`}>
                    <td className="px-6 py-4 font-semibold text-blue-800">{item.ma_hang_ban_ve}</td>
                    <td className="px-6 py-4">{item.ten_hang_ban_ve}</td>
                    <td className="px-6 py-4">{item.vai_tro}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.ma_hang_ban_ve)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hang_Ban_Ve;
