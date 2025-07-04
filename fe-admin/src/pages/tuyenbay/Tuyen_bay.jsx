import React, { useEffect, useState } from "react";
import axios from "axios";

const Tuyen_bay = () => {
  const [sanBays, setSanBays] = useState([]);
  const [tuyenBays, setTuyenBays] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_tuyen_bay: "",
    ma_san_bay_di: "",
    ma_san_bay_den: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/san-bay")
      .then((res) => setSanBays(res.data))
      .catch(() => setMessage("❌ Lỗi khi tải danh sách sân bay"));

    fetchTuyenBays();
  }, []);

  const fetchTuyenBays = () => {
    axios
      .get("http://localhost:8000/api/tuyen-bay")
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
        "http://localhost:8000/api/tuyen-bay",
        formData
      );
      setMessage(`✅ ${res.data.message}`);
      setFormData({ ma_tuyen_bay: "", ma_san_bay_di: "", ma_san_bay_den: "" });
      setShowForm(false);
      fetchTuyenBays();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
    }
  };

  const handleDelete = async (ma_tuyen_bay) => {
    if (!window.confirm(`Bạn có chắc muốn xoá tuyến bay ${ma_tuyen_bay}?`))
      return;

    try {
      await axios.delete(
        `http://localhost:8000/api/tuyen-bay/${ma_tuyen_bay}`
      );
      setMessage(`🗑️ Đã xoá tuyến bay ${ma_tuyen_bay}`);
      fetchTuyenBays(); // cập nhật lại danh sách
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi khi xoá tuyến bay"}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Danh sách tuyến bay
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm tuyến bay"}
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}

      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="ma_tuyen_bay"
              value={formData.ma_tuyen_bay}
              onChange={handleChange}
              placeholder="Mã tuyến bay"
              className="p-2 border rounded"
            />
            <select
              name="ma_san_bay_di"
              value={formData.ma_san_bay_di}
              onChange={handleChange}
              className="p-2 border rounded"
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
              className="p-2 border rounded"
            >
              <option value="">-- Sân bay đến --</option>
              {sanBays.map((sb) => (
                <option key={sb.ma_san_bay} value={sb.ma_san_bay}>
                  {sb.ten_san_bay} ({sb.ma_san_bay}) - {sb.thanh_pho}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <button
              onClick={handleAdd}
              className="bg-green-500 text-green-100 cursor-pointer transition duration-300 ease-in-out px-4 py-2 rounded hover:bg-green-200 hover:text-green-800"
            >
              Xác nhận thêm
            </button>
          </div>
        </div>
      )}

      {/* bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã tuyến bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sân bay đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sân bay đến
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tuyenBays.map((tb) => (
              <tr key={tb.ma_tuyen_bay}>
                <td className="px-6 py-4">{tb.ma_tuyen_bay}</td>
                <td className="px-6 py-4">
                  {tb.ten_san_bay_di} ({tb.ma_san_bay_di}) - {tb.thanh_pho_di}
                </td>
                <td className="px-6 py-4">
                  {tb.ten_san_bay_den} ({tb.ma_san_bay_den}) -{" "}
                  {tb.thanh_pho_den}
                </td>
                <td className="px-6 py-4 flex items-center justify-between">
                  <button className="text-blue-100 bg-blue-500 cursor-pointer rounded-md px-2 py-1  hover:text-blue-800 hover:bg-blue-200 mr-3">
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(tb.ma_tuyen_bay)}
                    className="text-red-100 bg-red-500 cursor-pointer rounded-md px-2 py-1 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {tuyenBays.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không có tuyến bay nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tuyen_bay;
