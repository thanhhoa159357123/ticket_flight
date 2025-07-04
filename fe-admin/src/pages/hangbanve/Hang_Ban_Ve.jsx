import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Hang_Ban_Ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_hang_ban_ve: "",
    ten_hang_ban_ve: "",
    vai_tro: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-hang-ban-ve/get")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8000/api-hang-ban-ve/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_ban_ve: "",
          ten_hang_ban_ve: "",
          vai_tro: "",
        });
        setMessage("✅ Thêm hãng bán vé thành công!");
        setTimeout(() => setMessage(""), 2500);
      })
      .catch((err) => {
        setMessage("❌ Lỗi khi thêm hãng bán vé!");
        setTimeout(() => setMessage(""), 2500);
      });
  };

  const handleDelete = async (ma_hang_ban_ve) => {
    if (!window.confirm(`Bạn có chắc muốn xoá hãng bán vé ${ma_hang_ban_ve}?`))
      return;

    try {
      await axios.delete(
        `http://localhost:8000/api-hang-ban-ve/delete/${ma_hang_ban_ve}`
      );
      setMessage(`🗑️ Đã xoá hãng bán vé ${ma_hang_ban_ve}`);
      fetchData();
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi khi xoá hãng bán vé"}`);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách hãng bán vé
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500 transition"
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? "Đóng" : "Thêm hãng bán vé"}
          </button>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="ma_hang_ban_ve"
                value={formData.ma_hang_ban_ve}
                onChange={handleChange}
                placeholder="Mã hãng bán vé"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
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
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-gradient-to-tr from-green-400 to-blue-500 px-6 py-2 rounded-full text-white font-bold shadow-md hover:from-green-500 hover:to-blue-600 transition"
              >
                <FaPlus /> Xác nhận thêm
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Mã hãng bán vé
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Tên hãng bán vé
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((hang_ban_ve, idx) => (
                <tr
                  key={hang_ban_ve.ma_hang_ban_ve}
                  className={`transition-all hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="px-6 py-4 font-semibold text-blue-800">{hang_ban_ve.ma_hang_ban_ve}</td>
                  <td className="px-6 py-4">{hang_ban_ve.ten_hang_ban_ve}</td>
                  <td className="px-6 py-4">{hang_ban_ve.vai_tro}</td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      // onClick={handleEdit} // Bổ sung chức năng sửa nếu cần
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(hang_ban_ve.ma_hang_ban_ve)}
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
  );
};

export default Hang_Ban_Ve;
