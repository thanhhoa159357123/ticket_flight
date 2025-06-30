import React from "react";

const Item_Information = ({ user, onEditField }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full text-[#1a202c] transition-all duration-300 ease-in-out relative">
      <div className="p-8 max-w-[1500px] mx-auto">
        <h3 className="text-[24px] mb-7 text-[#2d3748] pb-3 border-b border-[#e2e8f0] font-extrabold">
          Thông tin cá nhân
        </h3>

        {/* Họ tên */}
        <InfoRow label="Họ tên:" value={user?.ten_khach_hang} onEdit={() => onEditField("ten_khach_hang")} />

        {/* Email */}
        <InfoRow label="Email:" value={user?.email} onEdit={() => onEditField("email")} />

        {/* SĐT */}
        <InfoRow label="SĐT:" value={user?.so_dien_thoai} onEdit={() => onEditField("so_dien_thoai")} />

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
              onClick={() => onEditField("matkhau")}
              className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Row Component
// eslint-disable-next-line react-refresh/only-export-components
const InfoRow = ({ label, value, onEdit }) => (
  <div className="flex justify-between items-center px-4 border-b border-[#edf2f7] py-4">
    <div className="flex items-center flex-1 flex-wrap">
      <strong className="font-extrabold text-[#4a5568] min-w-[140px] mr-5">{label}</strong>
      <span className="text-[#2d3748] mr-4 text-[16px]">{value}</span>
    </div>
    <button
      onClick={onEdit}
      className="bg-[#4299e1] text-white px-3 py-[10px] rounded-md text-sm font-medium shadow-md hover:bg-[#3182ce] hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 transition-all"
    >
      Chỉnh sửa
    </button>
  </div>
);

export default Item_Information;
