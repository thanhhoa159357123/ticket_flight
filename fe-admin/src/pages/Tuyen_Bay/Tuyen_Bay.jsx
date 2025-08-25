import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const TuyenBay = () => {
  const [tuyenBays, setTuyenBays] = useState([]);
  const [sanBays, setSanBays] = useState([]);
  const [formData, setFormData] = useState({
    ma_tuyen_bay: "",
    ma_san_bay_di: "",
    ma_san_bay_den: "",
  });
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTuyenBays();
    fetchSanBays();
  }, []);

  const fetchTuyenBays = async () => {
    try {
      const res = await axios.get("http://localhost:8080/tuyen_bay");
      setTuyenBays(res.data);
    } catch (err) {
      setMessage("Không thể tải dữ liệu tuyến bay.");
    }
  };

  const fetchSanBays = async () => {
    try {
      const res = await axios.get("http://localhost:8080/san_bay");
      setSanBays(res.data);
    } catch (err) {
      setMessage("Không thể tải dữ liệu sân bay.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddForm = () => {
    setFormData({
      ma_tuyen_bay: "",
      ma_san_bay_di: "",
      ma_san_bay_den: "",
    });
    setIsEdit(false);
    setShowForm(true);
    setMessage("");
  };

  const handleEdit = (tuyen) => {
    setFormData({ ...tuyen });
    setIsEdit(true);
    setShowForm(true);
    setMessage("");
  };

  const handleCancel = () => {
    setFormData({
      ma_tuyen_bay: "",
      ma_san_bay_di: "",
      ma_san_bay_den: "",
    });
    setIsEdit(false);
    setShowForm(false);
    setMessage("");
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`http://localhost:8080/tuyen_bay/${formData.ma_tuyen_bay}`, formData);
        setMessage("Cập nhật thành công!");
      } else {
        await axios.post("http://localhost:8080/tuyen_bay", formData);
        setMessage("Thêm tuyến bay thành công!");
      }
      fetchTuyenBays();
      handleCancel();
    } catch (err) {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (ma) => {
    if (!window.confirm("Bạn có chắc muốn xóa tuyến bay này?")) return;
    try {
      await axios.delete(`http://localhost:8080/tuyen_bay/${ma}`);
      setMessage("Xóa thành công!");
      fetchTuyenBays();
    } catch (err) {
      setMessage("Xóa thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách tuyến bay
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
          >
            <FaPlus /> Thêm tuyến bay
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
              style={{ minWidth: 340, maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa tuyến bay" : "Thêm tuyến bay"}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes className="text-xl text-blue-400" />
                </button>
              </div>
              <div className="grid gap-4">
                <input
                  name="ma_tuyen_bay"
                  value={formData.ma_tuyen_bay}
                  onChange={handleChange}
                  disabled={isEdit}
                  placeholder="Mã tuyến bay"
                  className="p-3 border border-blue-200 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400"
                />
                <select
                  name="ma_san_bay_di"
                  value={formData.ma_san_bay_di}
                  onChange={handleChange}
                  className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Chọn sân bay đi --</option>
                  {sanBays.map((sb) => (
                    <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
                      {sb.ten_san_bay}
                    </option>
                  ))}
                </select>
                <select
                  name="ma_san_bay_den"
                  value={formData.ma_san_bay_den}
                  onChange={handleChange}
                  className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Chọn sân bay đến --</option>
                  {sanBays.map((sb) => (
                    <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
                      {sb.ten_san_bay}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-8 flex gap-2">
                <button
                  onClick={handleSubmit}
                  className={`w-full ${isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"} py-3 rounded-full text-white font-bold shadow-md transition text-base`}
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
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Mã tuyến bay</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Sân bay đi</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">Sân bay đến</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tuyenBays.map((item, idx) => (
                  <tr key={item.ma_tuyen_bay} className={`transition-all ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"} hover:bg-blue-50`}>
                    <td className="px-6 py-4 font-semibold text-blue-800">{item.ma_tuyen_bay}</td>
                    <td className="px-6 py-4">{item.ma_san_bay_di}</td>
                    <td className="px-6 py-4">{item.ma_san_bay_den}</td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.ma_tuyen_bay)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {tuyenBays.length === 0 && (
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

export default TuyenBay;
