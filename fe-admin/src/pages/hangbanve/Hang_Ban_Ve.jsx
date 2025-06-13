import React, { useState, useEffect } from "react";
import axios from "axios";

const Hang_Ban_Ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    ma_hang_ban_ve: "",
    ten_hang_ban_ve: "",
    vai_tro: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api-hang-ban-ve/get")
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
      .post("http://localhost:8000/api-hang-ban-ve/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_ban_ve: "",
          ten_hang_ban_ve: "",
          vai_tro: "",
        });
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = async (ma_hang_ban_ve) => {
    if (!window.confirm(`Bạn có chắc muốn xoá tuyến bay ${ma_hang_ban_ve}?`))
      return;

    try {
      await axios.delete(
        `http://localhost:8000/api-hang-ban-ve/delete/${ma_hang_ban_ve}`
      );
      setMessage(`🗑️ Đã xoá tuyến bay ${ma_hang_ban_ve}`);
      fetchData(); // cập nhật lại danh sách
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.detail || "Lỗi khi xoá tuyến bay"}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Danh sách hãng bán vé</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm hãng bán vé"}
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-blue-700">{message}</div>}

      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_hang_ban_ve"
              value={formData.ma_hang_ban_ve}
              onChange={handleChange}
              placeholder="Mã hãng bán vé"
              className="p-2 border rounded"
            />
            <input
              name="ten_hang_ban_ve"
              value={formData.ten_hang_ban_ve}
              onChange={handleChange}
              placeholder="Tên hãng bán vé"
              className="p-2 border rounded"
            />
            <input
              name="vai_tro"
              value={formData.vai_tro}
              onChange={handleChange}
              placeholder="Vai Trò"
              className="p-2 border rounded"
            />
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã hãng bán vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên hãng bán vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((hang_ban_ve) => (
              <tr
                key={hang_ban_ve.ma_hang_ban_ve}
                className="transition-colors"
              >
                <td className="px-6 py-4">{hang_ban_ve.ma_hang_ban_ve}</td>
                <td className="px-6 py-4">{hang_ban_ve.ten_hang_ban_ve}</td>
                <td className="px-6 py-4">{hang_ban_ve.vai_tro}</td>
                <td className="px-6 py-4 flex items-center justify-between">
                  <button className="text-blue-100 bg-blue-500 cursor-pointer transition duration-300 ease-in-out rounded-md px-2 py-1 hover:text-blue-800 hover:bg-blue-200 mr-3">
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(hang_ban_ve.ma_hang_ban_ve)}
                    className="text-red-100 bg-red-500 cursor-pointer transition duration-300 ease-in-out rounded-md px-2 py-1 hover:text-red-800 hover:bg-red-200"
                  >
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

export default Hang_Ban_Ve;
