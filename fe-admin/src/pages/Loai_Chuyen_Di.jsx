import React, { useState, useEffect } from "react";
import axios from "axios";

const Loai_Chuyen_Di = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_chuyen_di: "",
    ten_chuyen_di: "",
    mo_ta: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api/loai-chuyen-di")
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
      .post("http://localhost:8000/api-loai-chuyen-di/add", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_loai_chuyen_di: "",
          ten_loai_chuyen_di: "",
          mo_ta: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">
          Danh sách loại chuyến đi
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm loại chuyến đi"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_chuyen_di"
              value={formData.ma_chuyen_di}
              onChange={handleChange}
              placeholder="Mã loại chuyến đi"
              className="border p-2 rounded"
            />
            <input
              name="ten_chuyen_di"
              value={formData.ten_chuyen_di}
              onChange={handleChange}
              placeholder="Tên loại chuyến đi"
              className="border p-2 rounded"
            />
            <input
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleChange}
              placeholder="Mô tả"
              className="border p-2 rounded"
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
                Mã loại chuyến đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên loại chuyến đi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((loai_chuyen_di) => (
              <tr
                key={loai_chuyen_di.ma_chuyen_di}
                className="transition-colors"
              >
                <td className="px-6 py-4">{loai_chuyen_di.ma_chuyen_di}</td>
                <td className="px-6 py-4">{loai_chuyen_di.ten_chuyen_di}</td>
                <td className="px-6 py-4">{loai_chuyen_di.mo_ta}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Sửa
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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

export default Loai_Chuyen_Di;
