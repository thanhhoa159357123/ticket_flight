import React, { useState, useEffect } from "react";
import axios from "axios";

const Hang_Bay = () => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ma_hang_bay: "",
    ten_hang_bay: "",
    iata_code: "",
    quoc_gia: "",
  });

  const fetchData = () => {
    axios
      .get("http://localhost:8000/hangbay")
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
      .post("http://localhost:8000/hangbay", formData)
      .then(() => {
        fetchData();
        setShowForm(false);
        setFormData({
          ma_hang_bay: "",
          ten_hang_bay: "",
          iata_code: "",
          quoc_gia: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Danh sách hãng bay</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-blue-100 px-4 py-2 rounded cursor-pointer transition duration-300 ease-in-out hover:bg-blue-200 hover:text-blue-800"
        >
          {showForm ? "Đóng" : "Thêm hãng bay"}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 border rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="ma_hang_bay"
              value={formData.ma_hang_bay}
              onChange={handleChange}
              placeholder="Mã hãng bay"
              className="p-2 border rounded"
            />
            <input
              name="ten_hang_bay"
              value={formData.ten_hang_bay}
              onChange={handleChange}
              placeholder="Tên hãng bay"
              className="p-2 border rounded"
            />
            <input
              name="iata_code"
              value={formData.iata_code}
              onChange={handleChange}
              placeholder="IATA Code"
              className="p-2 border rounded"
            />
            <input
              name="quoc_gia"
              value={formData.quoc_gia}
              onChange={handleChange}
              placeholder="Quốc gia"
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

      {/* bảng danh sách */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã hãng bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên hãng bay
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IATA code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quốc gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((hang_bay) => (
              <tr key={hang_bay.ma_hang_bay} className="transition-colors">
                <td className="px-6 py-4">{hang_bay.ma_hang_bay}</td>
                <td className="px-6 py-4">{hang_bay.ten_hang_bay}</td>
                <td className="px-6 py-4">{hang_bay.iata_code}</td>
                <td className="px-6 py-4">{hang_bay.quoc_gia}</td>
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

export default Hang_Bay;
