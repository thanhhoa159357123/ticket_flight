import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from "react-icons/fa";
import axios from "axios";

const STATUS_COLORS = {
  "Đang áp dụng": "bg-green-100 text-green-700",
  "Tạm ngừng": "bg-yellow-100 text-yellow-700",
  "Sắp ra mắt": "bg-blue-100 text-blue-700",
};

const Loai_Chuyen_Di = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_loai: "",
    ten_loai: "",
    mo_ta: "",
    trang_thai: "Đang áp dụng",
  });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(null);

  // Lấy dữ liệu loại chuyến đi
  const fetchData = async () => {
    try {
      const res = await axios.get("/api-loai-chuyen-di/get");
      // Đảm bảo data luôn là array
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else if (Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch {
      setMessage("❌ Lỗi khi tải danh sách loại chuyến đi");
      setData([]); // Đảm bảo luôn là array kể cả khi lỗi
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Thêm hoặc cập nhật loại chuyến đi
  const handleSubmit = async () => {
    const { ma_loai, ten_loai } = formData;
    if (!ma_loai || !ten_loai) {
      setMessage("⚠️ Vui lòng nhập đầy đủ mã và tên loại chuyến đi");
      return;
    }
    try {
      if (editing) {
        await axios.put(`/api-loai-chuyen-di/update/${editing}`, formData);
        setMessage("✅ Đã cập nhật loại chuyến đi!");
      } else {
        await axios.post("/api-loai-chuyen-di/add", formData);
        setMessage("✅ Thêm loại chuyến đi thành công!");
      }
      setFormData({ ma_loai: "", ten_loai: "", mo_ta: "", trang_thai: "Đang áp dụng" });
      setShowForm(false);
      setEditing(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi lưu loại chuyến đi!");
    }
  };

  // Sửa
  const handleEdit = (item) => {
    setFormData(item);
    setShowForm(true);
    setEditing(item.ma_loai);
  };

  // Xóa
  const handleDelete = async (ma_loai) => {
    if (!window.confirm(`Bạn có chắc muốn xóa loại chuyến đi "${ma_loai}"?`)) return;
    try {
      await axios.delete(`/api-loai-chuyen-di/delete/${ma_loai}`);
      setMessage("🗑️ Đã xóa loại chuyến đi!");
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi xóa loại chuyến đi!");
    }
  };

  // Lọc loại chuyến đi theo tìm kiếm
  const filteredData = Array.isArray(data)
    ? data.filter(
        (item) =>
          item.ma_loai?.toLowerCase().includes(search.toLowerCase()) ||
          item.ten_loai?.toLowerCase().includes(search.toLowerCase()) ||
          (item.mo_ta || "").toLowerCase().includes(search.toLowerCase()) ||
          (item.trang_thai || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách loại chuyến đi
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Tìm kiếm loại chuyến đi..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-2xl border border-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaSearch className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setFormData({ ma_loai: "", ten_loai: "", mo_ta: "", trang_thai: "Đang áp dụng" });
                setEditing(null);
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500 transition"
            >
              {showForm ? <FaTimes /> : <FaPlus />}
              {showForm ? "Đóng" : editing ? "Sửa loại" : "Thêm loại"}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form thêm/sửa */}
        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="ma_loai"
                value={formData.ma_loai}
                onChange={handleChange}
                placeholder="Mã loại chuyến đi"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
                disabled={!!editing}
              />
              <input
                name="ten_loai"
                value={formData.ten_loai}
                onChange={handleChange}
                placeholder="Tên loại chuyến đi"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="mo_ta"
                value={formData.mo_ta}
                onChange={handleChange}
                placeholder="Mô tả (tuỳ chọn)"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <select
                name="trang_thai"
                value={formData.trang_thai}
                onChange={handleChange}
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="Đang áp dụng">Đang áp dụng</option>
                <option value="Tạm ngừng">Tạm ngừng</option>
                <option value="Sắp ra mắt">Sắp ra mắt</option>
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-tr from-green-400 to-blue-500 px-6 py-2 rounded-full text-white font-bold shadow-md hover:from-green-500 hover:to-blue-600 transition"
              >
                <FaPlus /> {editing ? "Cập nhật" : "Xác nhận thêm"}
              </button>
            </div>
          </div>
        )}

        {/* Bảng dữ liệu */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Mã loại</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Tên loại</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Mô tả</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.ma_loai} className="transition-all hover:bg-blue-50">
                  <td className="px-6 py-4 font-semibold text-blue-800">{item.ma_loai}</td>
                  <td className="px-6 py-4">{item.ten_loai}</td>
                  <td className="px-6 py-4">{item.mo_ta}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[item.trang_thai] || "bg-gray-100 text-gray-500"}`}>
                      {item.trang_thai}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                      onClick={() => handleDelete(item.ma_loai)}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Không có loại chuyến đi phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loai_Chuyen_Di;
