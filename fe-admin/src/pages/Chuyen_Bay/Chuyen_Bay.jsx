import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const Chuyen_Bay = () => {
  const [chuyenBays, setChuyenBays] = useState([]);
  const [tuyenBays, setTuyenBays] = useState([]);
  const [hangBays, setHangBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    ma_chuyen_bay: "",
    gio_di: "",
    gio_den: "",
    trang_thai: "",
    ma_tuyen_bay: "",
    ma_hang_bay: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-chuyen-bay/get")
      .then((res) => setChuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách chuyến bay"));

    axios
      .get("http://localhost:8000/api-tuyen-bay/get")
      .then((res) => setTuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách tuyến bay"));

    axios
      .get("http://localhost:8000/api-hang-bay/get")
      .then((res) => setHangBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách hãng bay"));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const {
      ma_chuyen_bay,
      gio_di,
      gio_den,
      trang_thai,
      ma_tuyen_bay,
      ma_hang_bay,
    } = formData;
    if (
      !ma_chuyen_bay ||
      !gio_di ||
      !gio_den ||
      !trang_thai ||
      !ma_tuyen_bay ||
      !ma_hang_bay
    ) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api-chuyen-bay/add",
        formData
      );
      setMessage(`✅ ${res.data.message}`);
      setFormData({
        ma_chuyen_bay: "",
        gio_di: "",
        gio_den: "",
        trang_thai: "",
        ma_tuyen_bay: "",
        ma_hang_bay: "",
      });
      setShowForm(false);
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Lọc dữ liệu theo tìm kiếm
  const filteredChuyenBays = chuyenBays.filter((cb) => {
    const s = search.toLowerCase();
    return (
      cb.ma_chuyen_bay.toLowerCase().includes(s) ||
      cb.trang_thai.toLowerCase().includes(s) ||
      cb.ma_tuyen_bay.toLowerCase().includes(s) ||
      cb.ma_hang_bay.toLowerCase().includes(s)
    );
  });

  // Hàm lấy tên tuyến bay và hãng bay theo mã
  const getTuyenBayName = (ma_tuyen_bay) => {
    const tuyen = tuyenBays.find((t) => t.ma_tuyen_bay === ma_tuyen_bay);
    return tuyen
      ? `${tuyen.san_bay_di} → ${tuyen.san_bay_den}`
      : ma_tuyen_bay;
  };

  const getHangBayName = (ma_hang_bay) => {
    const hang = hangBays.find((h) => h.ma_hang_bay === ma_hang_bay);
    return hang ? hang.ten_hang_bay : ma_hang_bay;
  };

  // Hiển thị icon trạng thái
  const renderStatusIcon = (status) => {
    switch (status) {
      case "Đang hoạt động":
        return <FaCheckCircle className="text-green-500" title="Đang hoạt động" />;
      case "Hủy":
        return <FaTimesCircle className="text-red-500" title="Hủy" />;
      case "Đã hoàn thành":
        return <FaClock className="text-yellow-500" title="Đã hoàn thành" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700">Danh sách chuyến bay</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm mã, trạng thái, tuyến, hãng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-2 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-gradient-to-tr from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition"
            >
              {showForm ? <FaTimes /> : <FaPlus />}
              {showForm ? "Đóng" : "Thêm chuyến bay"}
            </button>
          </div>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Form thêm chuyến bay */}
        {showForm && (
          <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-blue-200 shadow-md animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="ma_chuyen_bay"
                value={formData.ma_chuyen_bay}
                onChange={handleChange}
                placeholder="Mã chuyến bay"
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                name="gio_di"
                type="datetime-local"
                value={formData.gio_di}
                onChange={handleChange}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                name="gio_den"
                type="datetime-local"
                value={formData.gio_den}
                onChange={handleChange}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                name="trang_thai"
                value={formData.trang_thai}
                onChange={handleChange}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Chọn trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Hủy">Hủy</option>
                <option value="Đã hoàn thành">Đã hoàn thành</option>
              </select>
              <select
                name="ma_tuyen_bay"
                value={formData.ma_tuyen_bay}
                onChange={handleChange}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Chọn tuyến bay --</option>
                {tuyenBays.map((tuyen) => (
                  <option key={tuyen.ma_tuyen_bay} value={tuyen.ma_tuyen_bay}>
                    {tuyen.ma_tuyen_bay} - {tuyen.san_bay_di} đến {tuyen.san_bay_den}
                  </option>
                ))}
              </select>
              <select
                name="ma_hang_bay"
                value={formData.ma_hang_bay}
                onChange={handleChange}
                className="p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Chọn hãng bay --</option>
                {hangBays.map((hang) => (
                  <option key={hang.ma_hang_bay} value={hang.ma_hang_bay}>
                    {hang.ten_hang_bay} ({hang.ma_hang_bay})
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAdd}
                className="bg-gradient-to-tr from-green-400 to-blue-500 px-6 py-2 rounded-full text-white font-semibold shadow hover:from-green-500 hover:to-blue-600 transition"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        )}

        {/* Bảng danh sách chuyến bay */}
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full bg-white rounded-xl divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Mã chuyến bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Giờ đi
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Giờ đến
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Tuyến bay
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                  Hãng bay
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredChuyenBays.map((cb) => (
                <tr
                  key={cb.ma_chuyen_bay}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-blue-800 select-all">
                    {cb.ma_chuyen_bay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FaPlaneDeparture className="text-blue-500" />
                    {new Date(cb.gio_di).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FaPlaneArrival className="text-cyan-500" />
                    {new Date(cb.gio_den).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold">
                    <div className="inline-flex items-center gap-1">
                      {renderStatusIcon(cb.trang_thai)}
                      <span>{cb.trang_thai}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {getTuyenBayName(cb.ma_tuyen_bay)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {getHangBayName(cb.ma_hang_bay)}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                      // onClick={...} // Thêm chức năng sửa nếu cần
                    >
                      <FaEdit /> Sửa
                    </button>
                    {/* Xóa nếu cần */}
                    {/* <button
                      onClick={() => handleDelete(cb.ma_chuyen_bay)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                    >
                      <FaTrash /> Xóa
                    </button> */}
                  </td>
                </tr>
              ))}
              {filteredChuyenBays.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-400 font-medium"
                  >
                    Không có chuyến bay phù hợp.
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

export default Chuyen_Bay;
