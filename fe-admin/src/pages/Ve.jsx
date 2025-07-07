import React, { useState, useEffect } from "react";
import axios from "axios";

const Ve = () => {
  const [veData, setVeData] = useState([]);
  const [hangVeData, setHangVeData] = useState([]);
  const [chuyenBayData, setChuyenBayData] = useState([]);
  const [hangBanVeData, setHangBanVeData] = useState([]);
  const [loaiChuyenDiData, setLoaiChuyenDiData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_gia_ve: "",
    gia: "",
    ma_hang_ve: "",
    ma_chuyen_bay: "",
    ma_hang_ban_ve: "",
    ma_chuyen_di: "",
  });

  const fetchVeData = () => {
    axios
      .get("http://localhost:8000/api/gia-ve")
      .then((res) => {
        console.log("✅ fetchVeData:", res.data);
        setVeData(res.data);
      })
      .catch((err) => {
        console.error("❌ fetchVeData lỗi:", err);
        setMessage("❌ Lỗi khi tải danh sách vé");
      });
  };

  const fetchHangVeData = () => {
    axios
      .get("http://localhost:8000/api/hang-ve")
      .then((res) => {
        console.log("✅ fetchHangVeData:", res.data);
        setHangVeData(res.data);
      })
      .catch((err) => {
        console.error("❌ fetchHangVeData lỗi:", err);
        setMessage("❌ Lỗi khi tải danh sách hạng vé");
      });
  };

  const fetchChuyenBayData = () => {
    axios
      .get("http://localhost:8000/api/chuyen-bay")
      .then((res) => {
        console.log("✅ fetchChuyenBayData:", res.data);
        setChuyenBayData(res.data);
      })
      .catch((err) => {
        console.error("❌ fetchChuyenBayData lỗi:", err);
        setMessage("❌ Lỗi khi tải danh sách chuyến bay");
      });
  };

  const fetchHangBanVeData = () => {
    axios
      .get("http://localhost:8000/api/hang-ban-ve")
      .then((res) => {
        console.log("✅ fetchHangBanVeData:", res.data);
        setHangBanVeData(res.data);
      })
      .catch((err) => {
        console.error("❌ fetchHangBanVeData lỗi:", err);
        setMessage("❌ Lỗi khi tải danh sách hãng bán vé");
      });
  };

  const fetchLoaiChuyenDiData = () => {
    axios
      .get("http://localhost:8000/api/loai-chuyen-di")
      .then((res) => {
        console.log("✅ fetchLoaiChuyenDiData:", res.data);
        setLoaiChuyenDiData(res.data);
      })
      .catch((err) => {
        console.error("❌ fetchLoaiChuyenDiData lỗi:", err);
        setMessage("❌ Lỗi khi tải danh sách loại chuyến đi");
      });
  };

  useEffect(() => {
    fetchVeData();
    fetchHangVeData();
    fetchChuyenBayData();
    fetchHangBanVeData();
    fetchLoaiChuyenDiData();

  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const {
      ma_gia_ve,
      gia,
      ma_hang_ve,
      ma_chuyen_bay,
      ma_hang_ban_ve,
      ma_chuyen_di,
    } = formData;
    if (
      !ma_gia_ve ||
      !gia ||
      !ma_hang_ve ||
      !ma_chuyen_bay ||
      !ma_hang_ban_ve ||
      !ma_chuyen_di
    ) {
      setMessage("❌ Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/gia-ve", formData);
      setMessage("✅ Thêm vé thành công");
      fetchVeData();
      setShowForm(false);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi không xác định"}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700 pb-2">Danh sách vé</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm vé"}
        </button>
      </div>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hạng vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Chuyến bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hãng bán vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại chuyến đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {veData.map((ve) => (
              <tr key={ve.ma_gia_ve}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ve.ma_gia_ve}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ve.gia}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hangVeData.find((hv) => hv.ma_hang_ve === ve.ma_hang_ve)
                    ?.vi_tri_ngoi || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {chuyenBayData.find(
                    (cb) => cb.ma_chuyen_bay === ve.ma_chuyen_bay
                  )?.ma_chuyen_bay || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {hangBanVeData.find(
                    (hbv) => hbv.ma_hang_ban_ve === ve.ma_hang_ban_ve
                  )?.ten_hang_ban_ve || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {loaiChuyenDiData.find(
                    (lcd) => lcd.ma_chuyen_di === ve.ma_chuyen_di
                  )?.ten_chuyen_di || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Thêm các hành động như sửa, xóa nếu cần */}
                  <button className="text-blue-600 hover:text-blue-900">
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-900 ml-2">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ve;
