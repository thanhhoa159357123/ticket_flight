import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";

const San_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_san_bay: "",
    ten_san_bay: "",
    thanh_pho: "",
    ma_quoc_gia: "",
    iata_code: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8080/san_bay")
      .then((res) => setData(res.data || []))
      .catch(() => setMessage("Không lấy được dữ liệu sân bay."));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({
      ma_san_bay: "",
      ten_san_bay: "",
      thanh_pho: "",
      ma_quoc_gia: "",
      iata_code: "",
    });
    setIsEdit(false);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (san_bay) => {
    setFormData({ ...san_bay });
    setIsEdit(true);
    setEditingId(san_bay.ma_san_bay);
    setShowForm(true);
    setMessage("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8080/san_bay", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setMessage("✅ Thêm sân bay thành công!");
      })
      .catch(() => setMessage("❌ Thêm sân bay thất bại!"));
  };

  const handleUpdate = () => {
    axios
      .put(`http://localhost:8080/san_bay/${editingId}`, formData, {
        header:{
          "Content-Type" : "application/json",
        }
      })
      .then(() => {
        fetchData();
        setShowForm(false);
        setIsEdit(false);
        setEditingId(null);
        setMessage("✅ Cập nhật sân bay thành công!");
      })
      .catch(() => setMessage("❌ Cập nhật sân bay thất bại!"));
  };

  const handleDelete = (ma_san_bay) => {
    if (!window.confirm("Bạn có chắc muốn xóa sân bay này?")) return;
    axios
      .delete(`http://localhost:8080/san_bay/${ma_san_bay}`)
      .then(() => {
        fetchData();
        setMessage("✅ Xóa sân bay thành công.");
      })
      .catch(() => setMessage("❌ Xóa sân bay thất bại!"));
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEdit(false);
    setEditingId(null);
    setMessage("");
    setFormData({
      ma_san_bay: "",
      ten_san_bay: "",
      thanh_pho: "",
      ma_quoc_gia: "",
      iata_code: "",
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700">Danh sách sân bay</h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold shadow hover:scale-105 transition"
          >
            <FaPlus /> Thêm sân bay
          </button>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <>
            <div
              className="fixed inset-0 z-40 bg-white bg-opacity-40 backdrop-blur-[6px]"
              onClick={handleCancel}
            />
            <div
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-2xl border border-blue-100 shadow-2xl px-8 py-9 w-full max-w-md animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa sân bay" : "Thêm sân bay"}
                </h3>
                <button onClick={handleCancel} className="text-xl text-blue-400 hover:bg-gray-100 p-2 rounded-full">
                  <FaTimes />
                </button>
              </div>
              <div className="grid gap-4">
                <input name="ma_san_bay" value={formData.ma_san_bay} onChange={handleChange} disabled={isEdit}
                  placeholder="Mã sân bay" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 bg-gray-100" />
                <input name="ten_san_bay" value={formData.ten_san_bay} onChange={handleChange}
                  placeholder="Tên sân bay" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400" />
                <input name="thanh_pho" value={formData.thanh_pho} onChange={handleChange}
                  placeholder="Thành phố" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400" />
                <input name="ma_quoc_gia" value={formData.ma_quoc_gia} onChange={handleChange}
                  placeholder="Mã quốc gia" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400" />
                <input name="iata_code" value={formData.iata_code} onChange={handleChange}
                  placeholder="IATA code" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full py-3 rounded-full text-white font-bold shadow-md transition text-base ${
                    isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {isEdit ? "Cập nhật" : "Xác nhận thêm"}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full font-bold shadow-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table danh sách */}
        <div className={showForm ? "pointer-events-none blur-[2px] select-none" : ""}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-blue-700">Mã sân bay</th>
                  <th className="px-6 py-4 text-left font-bold text-blue-700">Tên sân bay</th>
                  <th className="px-6 py-4 text-left font-bold text-blue-700">Thành phố</th>
                  <th className="px-6 py-4 text-left font-bold text-blue-700">Mã quốc gia</th>
                  <th className="px-6 py-4 text-left font-bold text-blue-700">IATA</th>
                  <th className="px-6 py-4 text-center font-bold text-blue-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map((sb, idx) => (
                  <tr key={sb.ma_san_bay} className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="px-6 py-4 font-semibold text-blue-800">{sb.ma_san_bay}</td>
                    <td className="px-6 py-4">{sb.ten_san_bay}</td>
                    <td className="px-6 py-4">{sb.thanh_pho}</td>
                    <td className="px-6 py-4">{sb.ma_quoc_gia}</td>
                    <td className="px-6 py-4">{sb.iata_code}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => handleEdit(sb)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow">
                        <FaEdit /> Sửa
                      </button>
                      <button onClick={() => handleDelete(sb.ma_san_bay)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow">
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
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

export default San_Bay;
