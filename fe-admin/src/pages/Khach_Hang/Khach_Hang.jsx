// components/KhachHang.jsx
import React from "react";
import { FaSearch, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useKhachHang } from "../../hooks/useKhachHang";

function KhachHang() {
  const {
    khachHangs,
    searchId,
    setSearchId,
    isClosing,
    isOpening,
    searchResult,
    message,
    showSearch,
    handleSearch,
    handleDelete,
    toggleSearchForm,
    handleCancel,
  } = useKhachHang();

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 drop-shadow">
            Danh sách khách hàng
          </h2>
          <button
            onClick={toggleSearchForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 transition"
          >
            <FaSearch /> Tìm khách hàng
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 font-semibold shadow">
            {message}
          </div>
        )}

        {/* Drawer tìm kiếm khách hàng */}
        {showSearch && (
          <>
            {/* Overlay */}
            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
                  ${isClosing ? "opacity-0" : "opacity-100"}`}
              onClick={handleCancel}
            ></div>

            {/* Drawer trượt từ phải */}
            <div
              className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50
                  transform transition-all duration-300 ease-out
                  ${
                    isClosing
                      ? "translate-x-full opacity-0 scale-95"
                      : isOpening
                      ? "translate-x-0 opacity-0 scale-95"
                      : "translate-x-0 opacity-100 scale-100"
                  }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-2xl font-bold text-blue-600">
                  Tìm khách hàng
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes className="text-2xl text-gray-600" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
                <form onSubmit={handleSearch} className="space-y-4">
                  <input
                    name="searchId"
                    placeholder="Nhập mã khách hàng (VD: KH_1693548392)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 transition"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-md transition"
                  >
                    Tìm kiếm
                  </button>
                </form>

                {/* Kết quả tìm kiếm */}
                {searchResult && (
                  <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Mã KH:</strong> {searchResult.ma_khach_hang}
                    </p>
                    <p>
                      <strong>Tên:</strong> {searchResult.ten_khach_hang}
                    </p>
                    <p>
                      <strong>Email:</strong> {searchResult.email}
                    </p>
                    <p>
                      <strong>SĐT:</strong> {searchResult.so_dien_thoai}
                    </p>
                    <p>
                      <strong>Ngày tạo:</strong>{" "}
                      {new Date(searchResult.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full font-bold shadow-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-200 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table danh sách */}
        <div
          className={
            showSearch ? "pointer-events-none select-none" : ""
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-xl rounded-2xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Mã KH
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    SĐT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {khachHangs.map((kh, idx) => (
                  <tr
                    key={kh.ma_khach_hang}
                    className={`hover:bg-blue-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-blue-800">
                      {kh.ma_khach_hang}
                    </td>
                    <td className="px-6 py-4">{kh.ten_khach_hang}</td>
                    <td className="px-6 py-4">{kh.so_dien_thoai}</td>
                    <td className="px-6 py-4">{kh.email}</td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button
                        disabled
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 cursor-not-allowed shadow"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(kh.ma_khach_hang)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 shadow"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {khachHangs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">
                      Không có dữ liệu khách hàng
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KhachHang;
