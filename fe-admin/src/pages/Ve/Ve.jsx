import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const Ve = () => {
  const [veData, setVeData] = useState([]);
  const [hangVeData, setHangVeData] = useState([]);
  const [chuyenBayData, setChuyenBayData] = useState([]);
  const [hangBanVeData, setHangBanVeData] = useState([]);
  const [loaiChuyenDiData, setLoaiChuyenDiData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    ma_gia_ve: "",
    gia: "",
    ma_hang_ve: "",
    ma_chuyen_bay: "",
    ma_hang_ban_ve: "",
    ma_chuyen_di: "",
  });

  // Fetch dữ liệu liên kết
  useEffect(() => {
    fetchVeData();
    fetchHangVeData();
    fetchChuyenBayData();
    fetchHangBanVeData();
    fetchLoaiChuyenDiData();
  }, []);

  const fetchVeData = () => {
    axios
      .get("http://localhost:8000/api/gia-ve")
      .then((res) => setVeData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách vé"));
  };

  const fetchHangVeData = () => {
    axios
      .get("http://localhost:8000/api/hang-ve")
      .then((res) => setHangVeData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách hạng vé"));
  };

  const fetchChuyenBayData = () => {
    axios
      .get("http://localhost:8000/api/chuyen-bay")
      .then((res) => setChuyenBayData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách chuyến bay"));
  };

  const fetchHangBanVeData = () => {
    axios
      .get("http://localhost:8000/api/hang-ban-ve")
      .then((res) => setHangBanVeData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách hãng bán vé"));
  };

  const fetchLoaiChuyenDiData = () => {
    axios
      .get("http://localhost:8000/api/loai-chuyen-di")
      .then((res) => setLoaiChuyenDiData(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách loại chuyến đi"));
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Thêm vé mới
  const handleAdd = async () => {
    const { ma_gia_ve, gia, ma_hang_ve, ma_chuyen_bay, ma_hang_ban_ve, ma_chuyen_di } = formData;
    if (!ma_gia_ve || !gia || !ma_hang_ve || !ma_chuyen_bay || !ma_hang_ban_ve || !ma_chuyen_di) {
      setMessage("❌ Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/gia-ve", formData);
      setMessage("✅ Thêm vé thành công");
      fetchVeData();
      setShowForm(false);
      setFormData({
        ma_gia_ve: "",
        gia: "",
        ma_hang_ve: "",
        ma_chuyen_bay: "",
        ma_hang_ban_ve: "",
        ma_chuyen_di: "",
      });
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
    }
  };

  // Lọc vé theo tìm kiếm
  const filteredVeData = veData.filter((ve) =>
    [ve.ma_gia_ve, ve.gia, ve.ma_hang_ve, ve.ma_chuyen_bay, ve.ma_hang_ban_ve, ve.ma_chuyen_di]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách vé máy bay
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm vé, chuyến bay, hạng vé..."
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
              {showForm ? "Đóng" : "Thêm vé"}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form thêm vé */}
        {showForm && (
          <div className="mb-6 bg-white border border-blue-100 rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="ma_gia_ve"
                value={formData.ma_gia_ve}
                onChange={handleChange}
                placeholder="Mã vé"
                className="p-2 border rounded"
              />
              <input
                name="gia"
                value={formData.gia}
                onChange={handleChange}
                placeholder="Giá vé"
                className="p-2 border rounded"
                type="number"
                min={0}
              />
              <select
                name="ma_hang_ve"
                value={formData.ma_hang_ve}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Chọn hạng vé</option>
                {hangVeData.map((item) => (
                  <option key={item.ma_hang_ve} value={item.ma_hang_ve}>
                    {item.ma_hang_ve} - {item.vi_tri_ngoi}
                  </option>
                ))}
              </select>
              <select
                name="ma_chuyen_bay"
                value={formData.ma_chuyen_bay}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Chọn chuyến bay</option>
                {chuyenBayData.map((item) => (
                  <option key={item.ma_chuyen_bay} value={item.ma_chuyen_bay}>
                    {item.ma_chuyen_bay} - {item.gio_di} đến {item.gio_den}
                  </option>
                ))}
              </select>
              <select
                name="ma_hang_ban_ve"
                value={formData.ma_hang_ban_ve}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Chọn hãng bán vé</option>
                {hangBanVeData.map((item) => (
                  <option key={item.ma_hang_ban_ve} value={item.ma_hang_ban_ve}>
                    {item.ma_hang_ban_ve} - {item.ten_hang_ban_ve}
                  </option>
                ))}
              </select>
              <select
                name="ma_chuyen_di"
                value={formData.ma_chuyen_di}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Chọn loại chuyến đi</option>
                {loaiChuyenDiData.map((item) => (
                  <option key={item.ma_chuyen_di} value={item.ma_chuyen_di}>
                    {item.ten_chuyen_di}
                  </option>
                ))}
              </select>
              <div>
                <button
                  onClick={handleAdd}
                  className="bg-green-500 text-green-100 cursor-pointer transition duration-300 ease-in-out px-4 py-2 rounded hover:bg-green-200 hover:text-green-800"
                >
                  Thêm vé
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bảng vé */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Mã vé</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Giá vé</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Hạng vé</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Chuyến bay</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Hãng bán vé</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase">Loại chuyến đi</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-blue-700 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredVeData.map((ve) => (
                <tr key={ve.ma_gia_ve} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 font-semibold text-blue-800">{ve.ma_gia_ve}</td>
                  <td className="px-6 py-4">{Number(ve.gia).toLocaleString()}₫</td>
                  <td className="px-6 py-4">
                    {hangVeData.find((hv) => hv.ma_hang_ve === ve.ma_hang_ve)?.vi_tri_ngoi || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {chuyenBayData.find((cb) => cb.ma_chuyen_bay === ve.ma_chuyen_bay)?.ma_chuyen_bay || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {hangBanVeData.find((hbv) => hbv.ma_hang_ban_ve === ve.ma_hang_ban_ve)?.ten_hang_ban_ve || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {loaiChuyenDiData.find((lcd) => lcd.ma_chuyen_di === ve.ma_chuyen_di)?.ten_chuyen_di || "N/A"}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition">
                      <FaEdit /> Sửa
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition">
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVeData.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Không có vé phù hợp.
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

export default Ve;
