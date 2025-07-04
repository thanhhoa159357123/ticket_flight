import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSuitcase, FaUndo, FaExchangeAlt, FaPlus, FaTimes, FaEdit, FaSearch } from "react-icons/fa";

const HANG_VE_COLORS = {
  ECONOMY: "from-green-200 to-green-50",
  BUSINESS: "from-blue-200 to-blue-50",
  FIRST: "from-yellow-200 to-yellow-50",
  PREMIUM: "from-pink-200 to-pink-50",
};

const getClassColor = (ma_hang_ve) => {
  if (!ma_hang_ve) return "from-gray-100 to-white";
  if (ma_hang_ve.toUpperCase().includes("ECO")) return HANG_VE_COLORS.ECONOMY;
  if (ma_hang_ve.toUpperCase().includes("BUS")) return HANG_VE_COLORS.BUSINESS;
  if (ma_hang_ve.toUpperCase().includes("FIR")) return HANG_VE_COLORS.FIRST;
  if (ma_hang_ve.toUpperCase().includes("PRE")) return HANG_VE_COLORS.PREMIUM;
  return "from-gray-100 to-white";
};

const Hang_ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    ma_hang_ve: "",
    vi_tri_ngoi: "",
    so_luong_hanh_ly: "",
    refundable: "",
    changeable: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-hang-ve/get")
      .then((res) => setData(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách hạng vé"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const { ma_hang_ve, vi_tri_ngoi, so_luong_hanh_ly, refundable, changeable } = formData;
    if (!ma_hang_ve || !vi_tri_ngoi || !so_luong_hanh_ly || !refundable || !changeable) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin");
      setTimeout(() => setMessage(""), 2500);
      return;
    }
    axios
      .post("http://localhost:8000/api-hang-ve/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_ve: "",
          vi_tri_ngoi: "",
          so_luong_hanh_ly: "",
          refundable: "",
          changeable: "",
        });
        setMessage("✅ Thêm hạng vé thành công!");
        setTimeout(() => setMessage(""), 2500);
      })
      .catch(() => {
        setMessage("❌ Lỗi khi thêm hạng vé!");
        setTimeout(() => setMessage(""), 2500);
      });
  };

  // Lọc theo mã, vị trí, quyền lợi
  const filteredData = data.filter(
    (item) =>
      item.ma_hang_ve?.toLowerCase().includes(search.toLowerCase()) ||
      item.vi_tri_ngoi?.toLowerCase().includes(search.toLowerCase()) ||
      String(item.refundable).toLowerCase().includes(search.toLowerCase()) ||
      String(item.changeable).toLowerCase().includes(search.toLowerCase())
  );

  // Badge trạng thái
  const renderBadge = (item) => {
    if (String(item.refundable) === "true" && String(item.changeable) === "true")
      return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold ml-2">Linh hoạt</span>;
    if (String(item.refundable) === "true")
      return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold ml-2">Hoàn tiền</span>;
    if (String(item.changeable) === "true")
      return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold ml-2">Đổi vé</span>;
    return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold ml-2">Cơ bản</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách hạng vé
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Tìm kiếm mã, vị trí, quyền lợi..."
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
              {showForm ? "Đóng" : "Thêm hạng vé"}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form thêm mới */}
        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="ma_hang_ve"
                value={formData.ma_hang_ve}
                onChange={handleChange}
                placeholder="Mã hạng vé (ECONOMY/BUSINESS/FIRST...)"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="vi_tri_ngoi"
                value={formData.vi_tri_ngoi}
                onChange={handleChange}
                placeholder="Vị trí ngồi"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                name="so_luong_hanh_ly"
                value={formData.so_luong_hanh_ly}
                onChange={handleChange}
                placeholder="Số lượng hành lý"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <select
                name="refundable"
                value={formData.refundable}
                onChange={handleChange}
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="">Hoàn tiền</option>
                <option value="true">Có</option>
                <option value="false">Không</option>
              </select>
              <select
                name="changeable"
                value={formData.changeable}
                onChange={handleChange}
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="">Đổi vé</option>
                <option value="true">Có</option>
                <option value="false">Không</option>
              </select>
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

        {/* Grid danh sách hạng vé */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {filteredData.map((item) => (
            <div
              key={item.ma_hang_ve}
              className={`bg-gradient-to-br ${getClassColor(item.ma_hang_ve)} rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-gray-700">{item.ma_hang_ve}</span>
                {renderBadge(item)}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium text-blue-600">Vị trí:</span> {item.vi_tri_ngoi}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FaSuitcase className="text-blue-600" title="Hành lý" />
                <span className="text-sm text-gray-700">{item.so_luong_hanh_ly} kiện</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <FaUndo className={String(item.refundable) === "true" ? "text-green-600" : "text-gray-400"} title="Hoàn tiền" />
                  <span className="text-xs">{String(item.refundable) === "true" ? "Có hoàn tiền" : "Không hoàn tiền"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaExchangeAlt className={String(item.changeable) === "true" ? "text-yellow-600" : "text-gray-400"} title="Đổi vé" />
                  <span className="text-xs">{String(item.changeable) === "true" ? "Có đổi vé" : "Không đổi vé"}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                  // onClick={...} // Thêm chức năng sửa nếu cần
                >
                  <FaEdit /> Sửa
                </button>
                {/* Có thể bổ sung nút xóa nếu muốn */}
              </div>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">
              Không tìm thấy hạng vé phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hang_ve;
