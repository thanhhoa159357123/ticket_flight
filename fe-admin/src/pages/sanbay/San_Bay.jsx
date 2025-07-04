import React, { useState, useEffect } from "react";
import axios from "axios";

const San_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_san_bay: "",
    ten_san_bay: "",
    thanh_pho: "",
    ma_quoc_gia: "",
    iata_code: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/api/san-bay")
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
      .post("http://localhost:8000/api/san-bay", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_san_bay: "",
          ten_san_bay: "",
          thanh_pho: "",
          ma_quoc_gia: "",
          iata_code: "",
        });
      })
      .catch((err) => console.error(err));
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Danh sách sân bay</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "Thêm sân bay"}
        </button>
      </div>
      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_san_bay"
              value={formData.ma_san_bay}
              onChange={handleChange}
              placeholder="Mã sân bay"
              className="p-2 border rounded"
            />
            <input
              name="ten_san_bay"
              value={formData.ten_san_bay}
              onChange={handleChange}
              placeholder="Tên sân bay"
              className="p-2 border rounded"
            />
            <input
              name="thanh_pho"
              value={formData.thanh_pho}
              onChange={handleChange}
              placeholder="Thành phố"
              className="p-2 border rounded"
            />
            <input
              name="ma_quoc_gia"
              value={formData.ma_quoc_gia}
              onChange={handleChange}
              placeholder="Mã quốc gia"
              className="p-2 border rounded"
            />
            <input
              name="iata_code"
              value={formData.iata_code}
              onChange={handleChange}
              placeholder="Iata code"
              className="p-2 border rounded"
            />
          </div>
          <div className="mt-4">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã sân bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sân bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành phố
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã quốc gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IATA code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((san_bay) => (
              <tr key={san_bay.ma_san_bay} className="transition-colors">
                <td className="px-6 py-4">{san_bay.ma_san_bay}</td>
                <td className="px-6 py-4">{san_bay.ten_san_bay}</td>
                <td className="px-6 py-4">{san_bay.thanh_pho}</td>
                <td className="px-6 py-4">{san_bay.ma_quoc_gia}</td>
                <td className="px-6 py-4">{san_bay.iata_code}</td>
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

export default San_Bay;
