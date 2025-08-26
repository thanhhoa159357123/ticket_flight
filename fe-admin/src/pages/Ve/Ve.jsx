import React from "react";
import { FaPlus, FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import useGiaVe from "../../hooks/useVe";

const Gia_Ve = () => {
  const {
    data,
    showForm,
    isEdit,
    formData,
    message,
    isClosing,
    isOpening,
    setMessage,
    handleChange,
    openAddForm,
    handleEdit,
    handleCancel,
    handleAdd,
    handleUpdate,
    handleDelete,
  } = useGiaVe();

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700">
            Danh sách giá vé
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105"
          >
            <FaPlus /> Thêm giá vé
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-4 px-4 py-3 bg-blue-100 text-blue-800 rounded-xl shadow">
            {message}
            <button
              onClick={() => setMessage("")}
              className="ml-3 text-sm text-red-500 hover:underline"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <>
            <div
              className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
                  ${isClosing ? "opacity-0" : "opacity-100"}`}
              onClick={handleCancel}
            ></div>
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
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa" : "Thêm"} giá vé
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes className="text-2xl text-gray-600" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
                <div className="grid grid-cols-1 gap-5">
                  {[
                    "ma_ve",
                    "gia_ve",
                    "ma_hang_ve",
                    "ma_chuyen_bay",
                    "ma_hang_ban_ve",
                  ].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={field.replaceAll("_", " ").toUpperCase()}
                      className="p-3 border border-gray-200 rounded-xl bg-gray-50
                         focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                      disabled={field === "ma_ve" && isEdit}
                    />
                  ))}
                </div>
              </div>
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
                  {isEdit ? "Cập nhật" : "Xác nhận thêm"}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-600 font-bold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </>
        )}

        {/* Bảng danh sách */}
        <div className={showForm ? "pointer-events-none" : ""}>
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-full bg-white rounded-xl">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="px-4 py-3 text-left">Mã vé</th>
                  <th className="px-4 py-3 text-left">Giá</th>
                  <th className="px-4 py-3 text-left">Hạng vé</th>
                  <th className="px-4 py-3 text-left">Chuyến bay</th>
                  <th className="px-4 py-3 text-left">Hãng bán vé</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={item.ma_ve}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                    } hover:bg-blue-100 transition`}
                  >
                    <td className="px-4 py-2 font-medium">{item.ma_ve}</td>
                    <td className="px-4 py-2">
                      {item.gia_ve.toLocaleString()} ₫
                    </td>
                    <td className="px-4 py-2">{item.ma_hang_ve}</td>
                    <td className="px-4 py-2">{item.ma_chuyen_bay}</td>
                    <td className="px-4 py-2">{item.ma_hang_ban_ve}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.ma_ve)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      Không có dữ liệu giá vé.
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

export default Gia_Ve;
