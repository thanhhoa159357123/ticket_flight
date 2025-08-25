import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const Chuyen_Bay = () => {
  const [chuyenBays, setChuyenBays] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [hangBays, setHangBays] = useState([]);
  const [sanBays, setSanBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    ma_chuyen_bay: "",
    thoi_gian_di: "",
    thoi_gian_den: "",
    ma_hang_bay: "",
    ma_san_bay_di: "",
    ma_san_bay_den: "",
  });

  const [bulkUpdateData, setBulkUpdateData] = useState({
    daysToAdd: 30,
  });

  const [filters, setFilters] = useState({
    search: "",
    hangBay: "",
    sanBayDi: "",
    sanBayDen: "",
    status: "all", // all | upcoming | past
    startDate: "",
    endDate: "",
  });

  // =============================
  // API FETCH
  // =============================
  useEffect(() => {
    fetchChuyenBays();
    fetchHangBays();
    fetchSanBays();
  }, []);

  const fetchChuyenBays = async () => {
    try {
      const res = await axios.get("http://localhost:8000/chuyenbay");
      setChuyenBays(res.data);
      setFilteredFlights(res.data);
    } catch {
      setMessage("❌ Lỗi khi tải danh sách chuyến bay");
    }
  };

  const fetchHangBays = async () => {
    try {
      const res = await axios.get("http://localhost:8000/hangbay");
      setHangBays(res.data);
    } catch {
      setMessage("❌ Lỗi khi tải danh sách hãng bay");
    }
  };

  const fetchSanBays = async () => {
    try {
      const res = await axios.get("http://localhost:8000/sanbay");
      setSanBays(res.data);
    } catch {
      setMessage("❌ Lỗi khi tải danh sách sân bay");
    }
  };

  // =============================
  // HANDLE FORM
  // =============================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const {
      ma_chuyen_bay,
      thoi_gian_den,
      thoi_gian_di,
      ma_hang_bay,
      ma_san_bay_di,
      ma_san_bay_den,
    } = formData;

    if (
      !ma_chuyen_bay ||
      !thoi_gian_den ||
      !thoi_gian_di ||
      !ma_hang_bay ||
      !ma_san_bay_di ||
      !ma_san_bay_den
    ) {
      setMessage("⚠️ Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/chuyenbay", formData);
      setMessage(`✅ ${res.data.message}`);
      setFormData({
        ma_chuyen_bay: "",
        thoi_gian_di: "",
        thoi_gian_den: "",
        ma_hang_bay: "",
        ma_san_bay_di: "",
        ma_san_bay_den: "",
      });
      setShowForm(false);
      fetchChuyenBays();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
    }
  };

  // =============================
  // BULK UPDATE
  // =============================
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
        "http://localhost:8000/chuyen-bay/bulk-update-dates",
        {
          days_to_add: bulkUpdateData.daysToAdd,
        }
      );

      setMessage(`✅ ${response.data.message}`);
      fetchChuyenBays();
      setShowBulkUpdate(false);
    } catch (error) {
      setMessage(
        `❌ ${error.response?.data?.detail || "Lỗi cập nhật hàng loạt"}`
      );
    }
  };

  // =============================
  // GENERATE FUTURE FLIGHTS
  // =============================
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
        "http://localhost:8000/chuyenbay/generate-future",
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

  // =============================
  // HANDLE FILTER
  // =============================
  useEffect(() => {
    let filtered = [...chuyenBays];

    // Search theo mã chuyến bay
    if (filters.search.trim() !== "") {
      filtered = filtered.filter((cb) =>
        cb.ma_chuyen_bay
          .toLowerCase()
          .includes(filters.search.trim().toLowerCase())
      );
    }

    // Lọc theo hãng bay
    if (filters.hangBay) {
      filtered = filtered.filter((cb) => cb.ma_hang_bay === filters.hangBay);
    }

    // Lọc sân bay đi
    if (filters.sanBayDi) {
      filtered = filtered.filter((cb) => cb.ma_san_bay_di === filters.sanBayDi);
    }

    // Lọc sân bay đến
    if (filters.sanBayDen) {
      filtered = filtered.filter((cb) => cb.ma_san_bay_den === filters.sanBayDen);
    }

    // Lọc trạng thái chuyến bay
    if (filters.status !== "all") {
      filtered = filtered.filter((cb) => {
        const flightDate = new Date(cb.thoi_gian_di);
        const isPast = flightDate < new Date();
        return filters.status === "past" ? isPast : !isPast;
      });
    }

    // Lọc theo khoảng ngày
    if (filters.startDate) {
      filtered = filtered.filter(
        (cb) => new Date(cb.thoi_gian_di) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (cb) => new Date(cb.thoi_gian_di) <= new Date(filters.endDate)
      );
    }

    setFilteredFlights(filtered);
  }, [filters, chuyenBays]);

  const resetFilters = () => {
    setFilters({
      search: "",
      hangBay: "",
      sanBayDi: "",
      sanBayDen: "",
      status: "all",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 pb-2">
            Danh sách chuyến bay
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulkUpdate(!showBulkUpdate)}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
          >
            {showBulkUpdate ? "Đóng" : "Cập nhật hàng loạt"}
          </button>

          <button
            onClick={generateFutureFlights}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Tạo lịch tương lai
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
          >
            {showForm ? "Đóng" : "Thêm chuyến bay"}
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Tìm theo mã chuyến bay"
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded"
        />
        <select
          value={filters.hangBay}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, hangBay: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="">-- Chọn hãng bay --</option>
          {hangBays.map((hang) => (
            <option key={hang.ma_hang_bay} value={hang.ma_hang_bay}>
              {hang.ten_hang_bay} ({hang.ma_hang_bay})
            </option>
          ))}
        </select>
        <select
          value={filters.sanBayDi}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sanBayDi: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="">-- Chọn sân bay đi --</option>
          {sanBays.map((sb) => (
            <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
              {sb.ten_san_bay} ({sb.ma_san_bay})
            </option>
          ))}
        </select>
        <select
          value={filters.sanBayDen}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, sanBayDen: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="">-- Chọn sân bay đến --</option>
          {sanBays.map((sb) => (
            <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
              {sb.ten_san_bay} ({sb.ma_san_bay})
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="p-2 border rounded"
        >
          <option value="all">Tất cả chuyến bay</option>
          <option value="upcoming">Chuyến sắp tới</option>
          <option value="past">Chuyến đã bay</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, startDate: e.target.value }))
          }
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, endDate: e.target.value }))
          }
          className="p-2 border rounded"
        />
        <button
          onClick={resetFilters}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Reset bộ lọc
        </button>
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

      {/* BẢNG DANH SÁCH */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã chuyến bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian đến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sân bay đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sân bay đến
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
            {filteredFlights.map((cb) => {
              const flightDate = new Date(cb.thoi_gian_di);
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
                  <td>
                    {cb.thoi_gian_di &&
                    dayjs(
                      cb.thoi_gian_di.trim(),
                      "DD/MM/YYYY, HH:mm:ss"
                    ).isValid()
                      ? dayjs(
                          cb.thoi_gian_di.trim(),
                          "DD/MM/YYYY, HH:mm:ss"
                        ).format("DD/MM/YYYY HH:mm")
                      : "Chưa có"}
                  </td>
                  <td>
                    {cb.thoi_gian_den &&
                    dayjs(
                      cb.thoi_gian_den.trim(),
                      "DD/MM/YYYY, HH:mm:ss"
                    ).isValid()
                      ? dayjs(
                          cb.thoi_gian_den.trim(),
                          "DD/MM/YYYY, HH:mm:ss"
                        ).format("DD/MM/YYYY HH:mm")
                      : "Chưa có"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {cb.ma_san_bay_di}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {cb.ma_san_bay_den}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {cb.ma_hang_bay}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-between">
                    <button className="text-blue-100 bg-blue-500 cursor-pointer rounded-md px-2 py-1 hover:text-blue-800 hover:bg-blue-200 mr-3 transition-colors">
                      Sửa
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredFlights.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Không có chuyến bay nào phù hợp.
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
