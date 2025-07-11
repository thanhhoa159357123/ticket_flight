import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserEdit, FaSearch } from "react-icons/fa";

const Khach_Hang = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/khachhang")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Lọc khách hàng theo tên, email, số điện thoại
  const filteredData = data.filter(
    (user) =>
      user.ten_khach_hang.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.so_dien_thoai.includes(search)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách khách hàng
          </h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Tìm kiếm tên, email, SĐT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full py-2 pl-10 pr-4 rounded-2xl border border-blue-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <FaSearch className="absolute left-3 top-2.5 w-5 h-5 text-blue-400" />
          </div>
        </div>

        {/* Grid danh sách khách hàng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {filteredData.map((user) => (
            <div
              key={user.ma_khach_hang}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold mb-4 shadow">
                {/* Avatar ký tự đầu tên */}
                {user.ten_khach_hang?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {user.ten_khach_hang}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-blue-600">Mã KH:</span> {user.ma_khach_hang}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-medium text-blue-600">SĐT:</span> {user.so_dien_thoai}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <span className="font-medium text-blue-600">Email:</span> {user.email}
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold shadow hover:from-blue-600 hover:to-cyan-500 transition"
                // onClick={() => ...} // Thêm chức năng sửa nếu cần
              >
                <FaUserEdit /> Sửa
              </button>
            </div>
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">
              Không tìm thấy khách hàng phù hợp.
            </div>
          )}
        </div>

        {/* Pagination mẫu (tĩnh, có thể nâng cấp thành động) */}
        <div className="mt-10 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredData.length} khách hàng
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-full text-gray-600 hover:bg-gray-100">
              Trước
            </button>
            <button className="px-3 py-1 border rounded-full bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded-full text-gray-600 hover:bg-gray-100">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Khach_Hang;
