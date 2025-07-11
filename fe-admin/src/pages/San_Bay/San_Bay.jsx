import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTimes, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const San_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_san_bay: "",
    ten_san_bay: "",
    thanh_pho: "",
    ma_quoc_gia: "",
    iata_code: "",
  });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-san-bay/get")
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
      .post("http://localhost:8000/api-san-bay/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_san_bay: "",
          ten_san_bay: "",
          thanh_pho: "",
          ma_quoc_gia: "",
          iata_code: "",
        });
        setMessage("✅ Thêm sân bay thành công!");
        setTimeout(() => setMessage(""), 2500);
      })
      .catch((err) => {
        setMessage("❌ Lỗi khi thêm sân bay!");
        setTimeout(() => setMessage(""), 2500);
      });
  };

  // Lọc theo tên, thành phố, mã sân bay, mã quốc gia, iata
  const filteredData = data.filter(
    (sb) =>
      sb.ten_san_bay?.toLowerCase().includes(search.toLowerCase()) ||
      sb.thanh_pho?.toLowerCase().includes(search.toLowerCase()) ||
      sb.ma_san_bay?.toLowerCase().includes(search.toLowerCase()) ||
      sb.ma_quoc_gia?.toLowerCase().includes(search.toLowerCase()) ||
      sb.iata_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách sân bay
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm tên, thành phố, IATA..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-2xl border border-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <FaSearch className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500 transition"
            >
              {showForm ? <FaTimes /> : <FaPlus />}
              {showForm ? "Đóng" : "Thêm sân bay"}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form Thêm */}
        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="ma_san_bay"
                value={formData.ma_san_bay}
                onChange={handleChange}
                placeholder="Mã sân bay"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="ten_san_bay"
                value={formData.ten_san_bay}
                onChange={handleChange}
                placeholder="Tên sân bay"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="thanh_pho"
                value={formData.thanh_pho}
                onChange={handleChange}
                placeholder="Thành phố"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="ma_quoc_gia"
                value={formData.ma_quoc_gia}
                onChange={handleChange}
                placeholder="Mã quốc gia"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="iata_code"
                value={formData.iata_code}
                onChange={handleChange}
                placeholder="IATA code"
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

        {/* Grid danh sách sân bay */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {filteredData.map((sb) => (
            <div
              key={sb.ma_san_bay}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold mb-4 shadow">
                {sb.iata_code?.toUpperCase() || sb.ma_san_bay?.toUpperCase() || "?"}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {sb.ten_san_bay}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-blue-600">Mã:</span> {sb.ma_san_bay}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-blue-600">Thành phố:</span> {sb.thanh_pho}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-blue-600">Quốc gia:</span> {sb.ma_quoc_gia}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <span className="font-medium text-blue-600">IATA:</span> {sb.iata_code}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                  // onClick={...} // Thêm chức năng sửa nếu cần
                >
                  <FaEdit /> Sửa
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                  // onClick={...} // Thêm chức năng xóa nếu cần
                >
                  <FaTrash /> Xóa
                </button>
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">
              Không tìm thấy sân bay phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default San_Bay;