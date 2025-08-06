import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Gia_Ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    ma_gia_ve: "",
    gia: "",
    ma_hang_ve: "",
    ma_chuyen_bay: "",
    ma_hang_ban_ve: "",
    goi_ve: "",
  });

  // Load danh sách vé
  const fetchData = () => {
    axios.get("http://localhost:8080/gia_ve")
      .then(res => setData(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        setData([]);
        setMessage("Không thể tải danh sách giá vé.");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openAddForm = () => {
    setFormData({
      ma_gia_ve: "",
      gia: "",
      ma_hang_ve: "",
      ma_chuyen_bay: "",
      ma_hang_ban_ve: "",
      goi_ve: "",
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (item) => {
    setFormData({ ...item });
    setIsEdit(true);
    setEditingId(item.ma_gia_ve);
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setEditingId(null);
    setMessage("");
  };

  const handleAdd = () => {
    axios.post("http://localhost:8080/gia_ve", formData)
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
    axios.put(`http://localhost:8080/gia_ve/${editingId}`, formData)
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

  const handleDelete = (ma_gia_ve) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giá vé này?")) return;
    axios.delete(`http://localhost:8080/gia_ve/${ma_gia_ve}`)
      .then(() => {
        fetchData();
        setMessage("Xóa thành công.");
      })
      .catch((err) => {
        setMessage(err.response?.data?.detail || "Xóa thất bại.");
      });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700">Danh sách giá vé</h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105">
            <FaPlus />
            Thêm giá vé
          </button>
        </div>

        {message && (
          <div className="mb-4 px-4 py-3 bg-blue-100 text-blue-800 rounded-xl shadow">
            {message}
          </div>
        )}

        {showForm && (
          <>
            <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-[8px] z-40" onClick={handleCancel}></div>
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-600">{isEdit ? "Chỉnh sửa" : "Thêm"} giá vé</h3>
                <button onClick={handleCancel} className="text-blue-500 hover:text-blue-700"><FaTimes /></button>
              </div>
              <div className="grid gap-4">
                {["ma_gia_ve", "gia", "ma_hang_ve", "ma_chuyen_bay", "ma_hang_ban_ve", "goi_ve"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.replaceAll("_", " ").toUpperCase()}
                    className="p-3 border border-blue-300 rounded-xl"
                    disabled={field === "ma_gia_ve" && isEdit}
                  />
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full py-3 rounded-full text-white font-bold ${
                    isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}>
                  {isEdit ? "Cập nhật" : "Xác nhận thêm"}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 font-bold">
                  Hủy
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table */}
        <div className={showForm ? "pointer-events-none blur-[2px]" : ""}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-4 py-3 text-left">Mã giá vé</th>
                  <th className="px-4 py-3 text-left">Giá</th>
                  <th className="px-4 py-3 text-left">Hạng vé</th>
                  <th className="px-4 py-3 text-left">Chuyến bay</th>
                  <th className="px-4 py-3 text-left">Hãng bán vé</th>
                  <th className="px-4 py-3 text-left">Gói vé</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={item.ma_gia_ve} className={`${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-100`}>
                    <td className="px-4 py-2 font-medium">{item.ma_gia_ve}</td>
                    <td className="px-4 py-2">{item.gia.toLocaleString()}</td>
                    <td className="px-4 py-2">{item.ma_hang_ve}</td>
                    <td className="px-4 py-2">{item.ma_chuyen_bay}</td>
                    <td className="px-4 py-2">{item.ma_hang_ban_ve}</td>
                    <td className="px-4 py-2">{item.goi_ve}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.ma_gia_ve)}
                        className="px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200">
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      Không có dữ liệu giá vé.
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

export default Gia_Ve;
