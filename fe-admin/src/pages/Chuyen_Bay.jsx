import React, { useEffect, useState } from "react";
import axios from "axios";

const Chuyen_Bay = () => {
  const [chuyenBays, setchuyenBays] = useState([]);
  const [tuyenBays, setTuyenBays] = useState([]);
  const [hangBays, setHangBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false); // 🆕 State cho bulk update
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_chuyen_bay: "",
    gio_di: "",
    gio_den: "",
    trang_thai: "",
    ma_tuyen_bay: "",
    ma_hang_bay: "",
  });

  // 🆕 State cho bulk update
  const [bulkUpdateData, setBulkUpdateData] = useState({
    daysToAdd: 30, // Cộng thêm 30 ngày
    selectedStatus: "Đang hoạt động",
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

  // 🆕 Hàm xử lý bulk update
  const handleBulkUpdateDates = async () => {
    if (
      !window.confirm(
        `Bạn có chắc muốn cập nhật tất cả chuyến bay cũ thêm ${bulkUpdateData.daysToAdd} ngày?\n\n⚠️ Thao tác này sẽ cập nhật TẤT CẢ chuyến bay có ngày cũ hơn hôm nay`
      )
    ) {
      return;
    }

    try {
      setMessage("🔄 Đang cập nhật hàng loạt...");

      const response = await axios.patch(
        "http://localhost:8000/api/chuyen-bay/bulk-update-dates",
        {
          days_to_add: bulkUpdateData.daysToAdd,
          new_status: bulkUpdateData.selectedStatus,
        }
      );

      setMessage(`✅ ${response.data.message}`);
      fetchChuyenBays(); // Refresh data
      setShowBulkUpdate(false);
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.detail || "Lỗi cập nhật hàng loạt"}`
      );
    }
  };

  // 🆕 Hàm tạo lịch bay tương lai
  const generateFutureFlights = async () => {
    if (
      !window.confirm(
        "Tạo lịch bay cho 30 ngày tới dựa trên mẫu hiện có?\n\n📅 Hệ thống sẽ copy các chuyến bay hiện tại và tạo lịch cho tháng tới"
      )
    ) {
      return;
    }

    try {
      setMessage("🔄 Đang tạo lịch bay tương lai...");

      const response = await axios.post(
        "http://localhost:8000/api/chuyen-bay/generate-future",
        {
          days_ahead: 30,
          base_date: new Date().toISOString(),
        }
      );

      setMessage(`✅ ${response.data.message}`);
      fetchChuyenBays();
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || "Lỗi tạo lịch bay"}`);
    }
  };

  // 🆕 Function để phân loại trạng thái chuyến bay
  const getFlightStatusInfo = () => {
    const now = new Date();
    const stats = {
      total: chuyenBays.length,
      active: 0,
      past: 0,
      future: 0,
    };

    chuyenBays.forEach((flight) => {
      const flightDate = new Date(flight.gio_di);
      if (flightDate < now) {
        stats.past++;
      } else {
        stats.future++;
        if (flight.trang_thai === "Đang hoạt động") {
          stats.active++;
        }
      }
    });

    return stats;
  };

  const flightStats = getFlightStatusInfo();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 pb-2">
            Danh sách chuyến bay
          </h2>
          {/* 🆕 Thống kê nhanh */}
          <div className="text-sm text-gray-600">
            Tổng: {flightStats.total} | Hoạt động: {flightStats.active} | Cũ:{" "}
            <span className="text-red-600">{flightStats.past}</span> | Tương
            lai: <span className="text-green-600">{flightStats.future}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {/* 🆕 Button Bulk Update */}
          <button
            onClick={() => setShowBulkUpdate(!showBulkUpdate)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            {showBulkUpdate ? "Đóng" : "Cập nhật hàng loạt"}
          </button>

          {/* 🆕 Button Generate Future */}
          <button
            onClick={generateFutureFlights}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Tạo lịch tương lai
          </button>

          {/* Button thêm chuyến bay */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
          >
            {showForm ? "Đóng" : "Thêm chuyến bay"}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.includes("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : message.includes("❌")
              ? "bg-red-50 text-red-700 border border-red-200"
              : message.includes("🔄")
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-50 text-gray-700 border border-gray-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* 🆕 Form cập nhật hàng loạt */}
      {showBulkUpdate && (
        <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800 mb-3">
            Cập nhật ngày bay hàng loạt
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ngày cần cộng thêm
              </label>
              <input
                type="number"
                value={bulkUpdateData.daysToAdd}
                onChange={(e) =>
                  setBulkUpdateData((prev) => ({
                    ...prev,
                    daysToAdd: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
                placeholder="VD: 30"
                min="1"
                max="365"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái mới
              </label>
              <select
                value={bulkUpdateData.selectedStatus}
                onChange={(e) =>
                  setBulkUpdateData((prev) => ({
                    ...prev,
                    selectedStatus: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500"
              >
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Sắp khởi hành">Sắp khởi hành</option>
                <option value="Đã lên lịch">Đã lên lịch</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleBulkUpdateDates}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full transition-colors"
              >
                Cập nhật hàng loạt
              </button>
            </div>
          </div>
          <div className="mt-3 p-3 bg-orange-100 rounded border border-orange-300">
            <p className="text-sm text-orange-800">
              ⚠️ <strong>Lưu ý:</strong> Thao tác này sẽ cập nhật TẤT CẢ chuyến
              bay có ngày cũ hơn hôm nay
            </p>
            <p className="text-xs text-orange-600 mt-1">
              • Chỉ cập nhật: giờ đi, giờ đến, trạng thái
              <br />
              • Giữ nguyên khoảng thời gian bay (duration)
              <br />• Không thêm field mới vào database
            </p>
          </div>
        </div>
      )}

      {/* Form thêm chuyến bay */}
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

      {/* Bảng danh sách */}
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
            {chuyenBays.map((cb) => {
              // 🆕 Kiểm tra xem chuyến bay có cũ không
              const flightDate = new Date(cb.gio_di);
              const isOldFlight = flightDate < new Date();

              return (
                <tr
                  key={cb.ma_chuyen_bay}
                  className={`transition-colors ${
                    isOldFlight ? "bg-red-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {cb.ma_chuyen_bay}
                    {isOldFlight && (
                      <span className="ml-2 text-xs text-red-500">• Cũ</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {new Date(cb.gio_di).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {new Date(cb.gio_den).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        cb.trang_thai === "Đang hoạt động"
                          ? "bg-green-100 text-green-800"
                          : cb.trang_thai === "Hủy"
                          ? "bg-red-100 text-red-800"
                          : cb.trang_thai === "Đã hoàn thành"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cb.trang_thai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {cb.ma_tuyen_bay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {cb.ma_hang_bay}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-between">
                    <button className="text-blue-100 bg-blue-500 cursor-pointer rounded-md px-2 py-1 hover:text-blue-800 hover:bg-blue-200 mr-3 transition-colors">
                      Sửa
                    </button>
                    {/* <button
                      onClick={() => handleDelete(cb.ma_chuyen_bay)}
                      className="text-red-100 bg-red-500 cursor-pointer rounded-md px-2 py-1 hover:text-red-800 hover:bg-red-200 transition-colors"
                    >
                      Xóa
                    </button> */}
                  </td>
                </tr>
              );
            })}
            {chuyenBays.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
