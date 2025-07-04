import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlaneDeparture, FaPlaneArrival, FaPlus, FaTimes, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

const Tuyen_bay = () => {
  const [sanBays, setSanBays] = useState([]);
  const [tuyenBays, setTuyenBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    ma_tuyen_bay: "",
    ma_san_bay_di: "",
    ma_san_bay_den: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api-san-bay/get")
      .then((res) => setSanBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách sân bay"));

    fetchTuyenBays();
  }, []);

  const fetchTuyenBays = () => {
    axios
      .get("http://localhost:8000/api-tuyen-bay/get")
      .then((res) => setTuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách tuyến bay"));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const { ma_tuyen_bay, ma_san_bay_di, ma_san_bay_den } = formData;
    if (!ma_tuyen_bay || !ma_san_bay_di || !ma_san_bay_den) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api-tuyen-bay/add",
        formData
      );
      setMessage(`✅ ${res.data.message}`);
      setFormData({ ma_tuyen_bay: "", ma_san_bay_di: "", ma_san_bay_den: "" });
      setShowForm(false);
      fetchTuyenBays();
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const handleDelete = async (ma_tuyen_bay) => {
    if (!window.confirm(`Bạn có chắc muốn xoá tuyến bay ${ma_tuyen_bay}?`))
      return;

    try {
      await axios.delete(
        `http://localhost:8000/api-tuyen-bay/delete/${ma_tuyen_bay}`
      );
      setMessage(`🗑️ Đã xoá tuyến bay ${ma_tuyen_bay}`);
      fetchTuyenBays();
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi khi xoá tuyến bay"}`);
      setTimeout(() => setMessage(""), 2500);
    }
  };

  // Lọc tuyến bay
  const filteredTuyenBays = tuyenBays.filter((tb) => {
    const searchLower = search.toLowerCase();
    return (
      tb.ma_tuyen_bay.toLowerCase().includes(searchLower) ||
      tb.ten_san_bay_di?.toLowerCase().includes(searchLower) ||
      tb.ten_san_bay_den?.toLowerCase().includes(searchLower) ||
      tb.ma_san_bay_di?.toLowerCase().includes(searchLower) ||
      tb.ma_san_bay_den?.toLowerCase().includes(searchLower) ||
      tb.thanh_pho_di?.toLowerCase().includes(searchLower) ||
      tb.thanh_pho_den?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header và tìm kiếm */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách tuyến bay
          </h2>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="Tìm tuyến, sân bay, thành phố..."
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
              {showForm ? "Đóng" : "Thêm tuyến bay"}
            </button>
          </div>
        </div>

        {/* Toast/thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-800 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form thêm mới */}
        {showForm && (
          <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                name="ma_tuyen_bay"
                value={formData.ma_tuyen_bay}
                onChange={handleChange}
                placeholder="Mã tuyến bay"
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <select
                name="ma_san_bay_di"
                value={formData.ma_san_bay_di}
                onChange={handleChange}
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="">-- Sân bay đi --</option>
                {sanBays.map((sb) => (
                  <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
                    {sb.ten_san_bay} ({sb.ma_san_bay}) - {sb.thanh_pho}
                  </option>
                ))}
              </select>
              <select
                name="ma_san_bay_den"
                value={formData.ma_san_bay_den}
                onChange={handleChange}
                className="p-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="">-- Sân bay đến --</option>
                {sanBays.map((sb) => (
                  <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
                    {sb.ten_san_bay} ({sb.ma_san_bay}) - {sb.thanh_pho}
                  </option>
                ))}
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

        {/* Bảng danh sách tuyến bay */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Mã tuyến bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Sân bay đi
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                  {/* Icon máy bay */}
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Sân bay đến
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTuyenBays.map((tb) => (
                <tr key={tb.ma_tuyen_bay} className="transition-all hover:bg-blue-50">
                  <td className="px-6 py-4 font-semibold text-blue-800 select-all">{tb.ma_tuyen_bay}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaPlaneDeparture className="text-blue-400" />
                      <div>
                        <div className="font-medium">{tb.ten_san_bay_di} <span className="text-xs text-gray-400">({tb.ma_san_bay_di})</span></div>
                        <div className="text-xs text-gray-500">{tb.thanh_pho_di}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center">
                    <FaPlaneDeparture className="text-blue-500 mx-auto rotate-90" size={22} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FaPlaneArrival className="text-cyan-400" />
                      <div>
                        <div className="font-medium">{tb.ten_san_bay_den} <span className="text-xs text-gray-400">({tb.ma_san_bay_den})</span></div>
                        <div className="text-xs text-gray-500">{tb.thanh_pho_den}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      // onClick={...} // Thêm chức năng sửa nếu cần
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(tb.ma_tuyen_bay)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                    >
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTuyenBays.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    Không có tuyến bay phù hợp.
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

export default Tuyen_bay;
