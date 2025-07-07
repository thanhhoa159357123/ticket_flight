import React, { useEffect, useState } from "react";
import axios from "axios";

const Chuyen_Bay = () => {
  const [chuyenBays, setchuyenBays] = useState([]);
  const [tuyenBays, setTuyenBays] = useState([]);
  const [hangBays, setHangBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_chuyen_bay: "",
    gio_di: "",
    gio_den: "",
    trang_thai: "",
    ma_tuyen_bay: "",
    ma_hang_bay: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/chuyen-bay")
      .then((res) => setchuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách chuyến bay"));
    fetchTuyenBays();
    fetchHangBays();
  }, []);

  const fetchTuyenBays = () => {
    axios
      .get("http://localhost:8000/api/tuyen-bay")
      .then((res) => setTuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách tuyến bay"));
  };

  const fetchHangBays = () => {
    axios
      .get("http://localhost:8000/api/hang-bay")
      .then((res) => setHangBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách hãng bay"));
  };

  const fetchChuyenBays = () => {
    axios
      .get("http://localhost:8000/api/chuyen-bay")
      .then((res) => setchuyenBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách chuyến bay"));
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
        "http://localhost:8000/api/chuyen-bay",
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
      fetchChuyenBays();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 pb-2">
          Danh sách chuyến bay
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm chuyến bay"}
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="ma_chuyen_bay"
              value={formData.ma_chuyen_bay}
              onChange={handleChange}
              placeholder="Mã chuyến bay"
              className="p-2 border rounded"
            />
            <input
              name="gio_di"
              type="datetime-local"
              value={formData.gio_di}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="gio_den"
              type="datetime-local"
              value={formData.gio_den}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <select
              name="trang_thai"
              value={formData.trang_thai}
              onChange={handleChange}
              className="p-2 border rounded"
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
              className="p-2 border rounded"
            >
              <option value="">-- Chọn tuyến bay --</option>
              {tuyenBays.map((tuyen) => (
                <option key={tuyen.ma_tuyen_bay} value={tuyen.ma_tuyen_bay}>
                  {tuyen.ma_tuyen_bay} - {tuyen.san_bay_di} đến{" "}
                  {tuyen.san_bay_den}
                </option>
              ))}
            </select>
            <select
              name="ma_hang_bay"
              value={formData.ma_hang_bay}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">-- Chọn hãng bay --</option>
              {hangBays.map((hang) => (
                <option key={hang.ma_hang_bay} value={hang.ma_hang_bay}>
                  {hang.ten_hang_bay} ({hang.ma_hang_bay})
                </option>
              ))}
            </select>
            <div>
              <button
                onClick={handleAdd}
                className="bg-green-500 text-green-100 cursor-pointer transition duration-300 ease-in-out px-4 py-2 rounded hover:bg-green-200 hover:text-green-800"
              >
                Xác nhận thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã chuyến bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giờ đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Giờ đến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tuyến bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hãng bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chuyenBays.map((cb) => (
              <tr key={cb.ma_chuyen_bay} className="transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {cb.ma_chuyen_bay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {new Date(cb.gio_di).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {new Date(cb.gio_den).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {cb.trang_thai}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {cb.ma_tuyen_bay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {cb.ma_hang_bay}
                </td>
                <td className="px-6 py-4 flex items-center justify-between">
                  <button className="text-blue-100 bg-blue-500 cursor-pointer rounded-md px-2 py-1  hover:text-blue-800 hover:bg-blue-200 mr-3">
                    Sửa
                  </button>
                  {/* <button
                    onClick={() => handleDelete(tb.ma_tuyen_bay)}
                    className="text-red-100 bg-red-500 cursor-pointer rounded-md px-2 py-1 hover:text-red-800"
                  >
                    Xóa
                  </button> */}
                </td>
              </tr>
            ))}
            {chuyenBays.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không có chuyến bay nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Chuyen_Bay;
