import React, { useEffect, useState } from "react";
import axios from "axios";

const Khach_Hang = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/khachhang")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b pb-2">
        Danh sách khách hàng
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã KH
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((user) => (
              <tr key={user.ma_khach_hang} className="transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {user.ma_khach_hang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {user.ten_khach_hang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {user.so_dien_thoai}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800 mr-3">
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (nếu cần) */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Hiển thị 1 đến 10 của {data.length} khách hàng
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
            Trước
          </button>
          <button className="px-3 py-1 border rounded bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default Khach_Hang;
