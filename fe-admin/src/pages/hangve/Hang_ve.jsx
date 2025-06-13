import React, { useEffect, useState } from "react";
import axios from "axios";

const Hang_ve = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
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
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 pb-2">
          Danh sách hạng vé
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm hạng vé"}
        </button>
      </div>
      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_hang_ve"
              value={formData.ma_hang_ve}
              onChange={handleChange}
              placeholder="Mã hạng vé"
              className="p-2 border rounded"
            />
            <input
              name="vi_tri_ngoi"
              value={formData.vi_tri_ngoi}
              onChange={handleChange}
              placeholder="Vị trí ngồi"
              className="p-2 border rounded"
            />
            <input
              name="so_luong_hanh_ly"
              value={formData.so_luong_hanh_ly}
              onChange={handleChange}
              placeholder="Số lượng hành lý"
              className="p-2 border rounded"
            />
            <input
              name="refundable"
              value={formData.refundable}
              onChange={handleChange}
              placeholder="Có hoàn tiền (true/false)"
              className="p-2 border rounded"
            />
            <input
              name="changeable"
              value={formData.changeable}
              onChange={handleChange}
              placeholder="Có thay đổi (true/false)"
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
          >
            Xác nhận thêm
          </button>
        </div>
      )}

      {/* bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã hạng vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vị trí ngồi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng hành lý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hoàn tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đổi chuyên bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.ma_hang_ve} className="transition-colors">
                <td className="px-6 py-4">{item.ma_hang_ve}</td>
                <td className="px-6 py-4">{item.vi_tri_ngoi}</td>
                <td className="px-6 py-4">{item.so_luong_hanh_ly}</td>
                <td className="px-6 py-4">{String(item.refundable)}</td>
                <td className="px-6 py-4">{String(item.changeable)}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Sửa
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

export default Hang_ve;
