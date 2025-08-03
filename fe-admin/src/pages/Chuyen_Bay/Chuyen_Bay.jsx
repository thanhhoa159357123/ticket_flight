import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";

const Chuyen_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_chuyen_bay: "",
    gio_di: "",
    gio_den: "",
    trang_thai: "",
    ma_hang_bay: "",
    ma_tuyen_bay: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8080/chuyen_bay")
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
    setFormData({
      ma_chuyen_bay: "",
      gio_di: "",
      gio_den: "",
      trang_thai: "",
      ma_hang_bay: "",
      ma_tuyen_bay: "",
    });
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
      .post("http://localhost:8080/chuyen_bay", formData)
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
      .put(`http://localhost:8080/chuyen_bay/${editingId}`, formData)
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
      .delete(`http://localhost:8080/chuyen_bay/${ma}`)
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
    setFormData({
      ma_chuyen_bay: "",
      gio_di: "",
      gio_den: "",
      trang_thai: "",
      ma_hang_bay: "",
      ma_tuyen_bay: "",
    });
    setMessage("");
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách chuyến bay
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
          >
            <FaPlus /> Thêm chuyến bay
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
              onClick={handleCancel}
            ></div>

            <div
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-2xl shadow-2xl border border-blue-100 w-full max-w-md
              px-8 py-9 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa chuyến bay" : "Thêm chuyến bay"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes className="text-xl text-blue-400" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input name="ma_chuyen_bay" value={formData.ma_chuyen_bay} onChange={handleChange} placeholder="Mã chuyến bay" disabled={isEdit} className="p-3 border border-blue-200 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none" />
                <input name="gio_di" value={formData.gio_di} onChange={handleChange} placeholder="Giờ đi (YYYY-MM-DD HH:mm:ss)" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                <input name="gio_den" value={formData.gio_den} onChange={handleChange} placeholder="Giờ đến (YYYY-MM-DD HH:mm:ss)" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                <input name="trang_thai" value={formData.trang_thai} onChange={handleChange} placeholder="Trạng thái" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                <input name="ma_hang_bay" value={formData.ma_hang_bay} onChange={handleChange} placeholder="Mã hãng bay" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
                <input name="ma_tuyen_bay" value={formData.ma_tuyen_bay} onChange={handleChange} placeholder="Mã tuyến bay" className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full ${isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} py-3 rounded-full text-white font-bold shadow-md transition`}
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

        <div className={showForm ? "pointer-events-none blur-[2px] select-none" : ""}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Mã chuyến bay</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Giờ đi</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Giờ đến</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Mã hãng bay</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">Mã tuyến bay</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map((cb, idx) => (
                  <tr key={cb.ma_chuyen_bay} className={`transition-all hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"}`}>
                    <td className="px-6 py-4 font-semibold text-blue-800">{cb.ma_chuyen_bay}</td>
                    <td className="px-6 py-4">{cb.gio_di}</td>
                    <td className="px-6 py-4">{cb.gio_den}</td>
                    <td className="px-6 py-4">{cb.trang_thai}</td>
                    <td className="px-6 py-4">{cb.ma_hang_bay}</td>
                    <td className="px-6 py-4">{cb.ma_tuyen_bay}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(cb)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(cb.ma_chuyen_bay)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
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

export default Chuyen_Bay;
