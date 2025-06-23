import React, { useState } from "react";

const Item_Information = ({ user, onEditField }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const handleEdit = (field) => {
    setEditingField(field);
  };

  const closeModal = () => {
    setEditingField(null);
  };

  return (
    <div className="w-full text-[#1a202c] transition-all duration-300 ease-in-out relative">
      <div className="p-8 max-w-[1500px] mx-auto">
        <h3 className="text-[24px] mb-7 text-[#2d3748] pb-3 border-b border-[#e2e8f0] font-extrabold">
          Thông tin cá nhân
        </h3>

        {/* Họ tên */}
        <div className="flex justify-between items-center px-4 border-b border-[#edf2f7] py-4">
          <div className="flex items-center flex-1 flex-wrap">
            <strong className="font-extrabold text-[#4a5568] min-w-[140px] mr-5">Họ tên:</strong>
            <span className="text-[#2d3748] mr-4 text-[16px]">{user?.ten_khach_hang}</span>
          </div>
          <button
            onClick={() => handleEdit("ten_khach_hang")}
            className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Email */}
        <div className="flex justify-between items-center px-4 border-b border-[#edf2f7] py-4">
          <div className="flex items-center flex-1 flex-wrap">
            <strong className="font-extrabold text-[#4a5568] min-w-[140px] mr-5">Email:</strong>
            <span className="text-[#2d3748] mr-4 text-[16px]">{user?.email}</span>
          </div>
          <button
            onClick={() => handleEdit("email")}
            className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
          >
            Chỉnh sửa
          </button>
        </div>

        {/* SĐT */}
        <div className="flex justify-between items-center px-4 border-b border-[#edf2f7] py-4">
          <div className="flex items-center flex-1 flex-wrap">
            <strong className="font-extrabold text-[#4a5568] min-w-[140px] mr-5">SĐT:</strong>
            <span className="text-[#2d3748] mr-4 text-[16px]">{user?.so_dien_thoai}</span>
          </div>
          <button
            onClick={() => handleEdit("so_dien_thoai")}
            className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Mật khẩu */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-[#edf2f7]">
          <div className="flex items-center flex-1 flex-wrap">
            <strong className="font-extrabold text-[#4a5568] min-w-[140px] mr-5">Mật khẩu:</strong>
            <span className="text-[#2d3748] mr-4 text-[16px]">
              {showPassword ? "Hiển thị tạm" : "••••••••"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#718096] hover:text-[#4299e1] text-[18px] transition-colors duration-200"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "👁️" : "👁‍🗨️"}
            </button>
            <button
              onClick={() => handleEdit("matkhau")}
              className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      {/* Overlay + Popup Edit */}
      {editingField && (
        <>
          {/* Overlay đen mờ nhẹ */}
          <div className="fixed inset-0 bg-black/40 z-10"></div>

          {/* Popup chỉnh sửa */}
          <div className="fixed top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md popup-animate">
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa {editingField}</h3>
            <input
              type="text"
              placeholder={`Nhập ${editingField} mới`}
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onEditField(editingField);
                  closeModal();
                }}
                className="px-4 py-2 bg-[#4299e1] text-white rounded hover:bg-[#3182ce]"
              >
                Lưu
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Item_Information;
