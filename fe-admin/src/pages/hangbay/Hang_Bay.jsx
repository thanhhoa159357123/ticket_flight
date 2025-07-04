import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";

const Hang_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_hang_bay: "",
    ten_hang_bay: "",
    iata_code: "",
    quoc_gia: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-hang-bay/get")
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
      .post("http://localhost:8000/api-hang-bay/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_bay: "",
          ten_hang_bay: "",
          iata_code: "",
          quoc_gia: "",
        });
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (ma_hang_bay) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa hãng bay này?");
    if (!confirmDelete) return;

    axios
      .delete(`http://localhost:8000/api-hang-bay/delete/${ma_hang_bay}`)
      .then(() => {
        fetchData();
        alert("Xóa thành công.");
      })
      .catch((err) => {
        console.error(err);
        alert("Xóa thất bại. Vui lòng thử lại.");
      });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách hãng bay
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500`}
          >
            {showForm ? <FaTimes /> : <FaPlus />}
            {showForm ? "Đóng" : "Thêm hãng bay"}
          </button>
        </div>

        {/* Form Thêm */}
        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="ma_hang_bay"
                value={formData.ma_hang_bay}
                onChange={handleChange}
                placeholder="Mã hãng bay"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="ten_hang_bay"
                value={formData.ten_hang_bay}
                onChange={handleChange}
                placeholder="Tên hãng bay"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="iata_code"
                value={formData.iata_code}
                onChange={handleChange}
                placeholder="IATA Code"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="quoc_gia"
                value={formData.quoc_gia}
                onChange={handleChange}
                placeholder="Quốc gia"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAdd}
                className="bg-gradient-to-tr from-green-400 to-blue-500 px-6 py-2 rounded-full text-white font-bold shadow-md hover:from-green-500 hover:to-blue-600 transition"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        )}

        {/* Bảng danh sách */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Mã hãng bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Tên hãng bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  IATA code
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Quốc gia
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((hang_bay, idx) => (
                <tr
                  key={hang_bay.ma_hang_bay}
                  className={`transition-all hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                >
                  <td className="px-6 py-4 font-semibold text-blue-800">{hang_bay.ma_hang_bay}</td>
                  <td className="px-6 py-4">{hang_bay.ten_hang_bay}</td>
                  <td className="px-6 py-4">{hang_bay.iata_code}</td>
                  <td className="px-6 py-4">{hang_bay.quoc_gia}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      // onClick={handleEdit} // Bổ sung chức năng sửa nếu cần
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(hang_bay.ma_hang_bay)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                    >
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
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

export default Hang_Bay;
