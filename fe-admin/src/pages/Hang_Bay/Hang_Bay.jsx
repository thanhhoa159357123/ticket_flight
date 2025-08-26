import React from "react";
import { FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import { useHangBay } from "../../hooks/useHangBay";

const Hang_Bay = () => {
  const {
    data,
    message,
    showForm,
    isEdit,
    isOpening,
    isClosing,
    formData,
    handleChange,
    openAddForm,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleCancel,
  } = useHangBay();

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight drop-shadow">
            Danh sách hãng bay
          </h2>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-lg transition bg-gradient-to-tr from-blue-500 to-cyan-400 text-white font-semibold hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
          >
            <FaPlus />
            Thêm hãng bay
          </button>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-blue-100 text-blue-900 font-semibold shadow animate-fade-in">
            {message}
          </div>
        )}

        {/* Drawer thêm/sửa hãng bay */}
        {showForm && (
          <>
            {/* Overlay nền tối */}
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
                  {isEdit ? "Chỉnh sửa hãng bay" : "Thêm hãng bay"}
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
                <div className="grid grid-cols-1 gap-5">
                  {[
                    {
                      name: "ma_hang_bay",
                      placeholder: "Mã hãng bay",
                      disabled: isEdit,
                    },
                    { name: "ten_hang_bay", placeholder: "Tên hãng bay" },
                    { name: "iata_code", placeholder: "IATA code" },
                    { name: "quoc_gia", placeholder: "Quốc gia" },
                  ].map(({ name, placeholder, disabled }) => (
                    <input
                      key={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      disabled={disabled}
                      className="p-3 border border-gray-200 rounded-xl bg-gray-50
                         focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
                    />
                  ))}
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

        {/* Bảng */}
        <div className={showForm ? "pointer-events-none" : ""}>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-gradient-to-r from-blue-100 to-cyan-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Mã hãng bay
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Tên hãng bay
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    IATA code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-blue-700 uppercase">
                    Quốc gia
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-blue-700 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((hangbay, idx) => (
                    <tr
                      key={hangbay.ma_hang_bay}
                      className={`transition-all hover:bg-blue-50 ${
                        idx % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-blue-800">
                        {hangbay.ma_hang_bay}
                      </td>
                      <td className="px-6 py-4">{hangbay.ten_hang_bay}</td>
                      <td className="px-6 py-4">{hangbay.iata_code}</td>
                      <td className="px-6 py-4">{hangbay.quoc_gia}</td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(hangbay)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 shadow"
                        >
                          <FaEdit /> Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(hangbay.ma_hang_bay)}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 shadow"
                        >
                          <FaTrash /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
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

export default Hang_Bay;
