import React from "react";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { useChuyenBay } from "../../hooks/useChuyenBay";

const Chuyen_Bay = () => {
  const {
    data,
    showForm,
    isEdit,
    message,
    formData,
    isClosing,
    isOpening,
    handleChange,
    openAddForm,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleCancel,
  } = useChuyenBay();

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách chuyến bay
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
          >
            <FaPlus /> Thêm chuyến bay
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Drawer thêm/sửa chuyến bay */}
        {showForm && (
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
                  {isEdit ? "Chỉnh sửa chuyến bay" : "Thêm chuyến bay"}
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
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="ma_chuyen_bay"
                    value={formData.ma_chuyen_bay}
                    onChange={handleChange}
                    placeholder="Mã chuyến bay"
                    disabled={isEdit}
                    className="p-3 border border-gray-200 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="datetime-local"
                    name="thoi_gian_di"
                    value={formData.thoi_gian_di}
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    type="datetime-local"
                    name="thoi_gian_den"
                    value={formData.thoi_gian_den}
                    onChange={handleChange}
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    name="ma_hang_bay"
                    value={formData.ma_hang_bay}
                    onChange={handleChange}
                    placeholder="Mã hãng bay"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    name="ma_san_bay_di"
                    value={formData.ma_san_bay_di}
                    onChange={handleChange}
                    placeholder="Mã sân bay đi"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <input
                    name="ma_san_bay_den"
                    value={formData.ma_san_bay_den}
                    onChange={handleChange}
                    placeholder="Mã sân bay đến"
                    className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full py-3 rounded-full text-white font-bold shadow-md transition 
                      ${
                        isEdit
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                >
                  {isEdit ? "Cập nhật" : "Thêm mới"}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full font-bold shadow-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </>
        )}

        {/* Table */}
        <div
          className={
            showForm ? "pointer-events-none select-none" : ""
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase tracking-wider">
                    Mã chuyến bay
                  </th>
                  <th className="px-6 py-4">Giờ đi</th>
                  <th className="px-6 py-4">Giờ đến</th>
                  <th className="px-6 py-4">Mã hãng bay</th>
                  <th className="px-6 py-4">Mã sân bay đi</th>
                  <th className="px-6 py-4">Mã sân bay đến</th>
                  <th className="px-6 py-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((cb, idx) => (
                    <tr
                      key={cb.ma_chuyen_bay}
                      className={`transition-all hover:bg-blue-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-blue-800">
                        {cb.ma_chuyen_bay}
                      </td>
                      <td className="px-6 py-4">{cb.thoi_gian_di}</td>
                      <td className="px-6 py-4">{cb.thoi_gian_den}</td>
                      <td className="px-6 py-4">{cb.ma_hang_bay}</td>
                      <td className="px-6 py-4">{cb.ma_san_bay_di}</td>
                      <td className="px-6 py-4">{cb.ma_san_bay_den}</td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(cb)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow transition"
                        >
                          <FaEdit /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(cb.ma_chuyen_bay)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow transition"
                        >
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      Không có dữ liệu
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
};

export default Chuyen_Bay;
