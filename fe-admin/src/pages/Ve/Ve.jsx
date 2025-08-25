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
              className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-[8px] z-40"
              onClick={handleCancel}
            />
            <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-200">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold text-blue-600">
                  {isEdit ? "Chỉnh sửa" : "Thêm"} giá vé
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="grid gap-4">
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
                    className="p-3 border border-blue-300 rounded-xl"
                    disabled={field === "ma_ve" && isEdit}
                  />
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <button
                  onClick={isEdit ? handleUpdate : handleAdd}
                  className={`w-full py-3 rounded-full text-white font-bold ${
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
        <div className={showForm ? "pointer-events-none blur-[2px]" : ""}>
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
