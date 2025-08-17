import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";

const TicketPackageCard = ({ pkg, onShowMoreDetail, onChoose }) => {
  // ✅ Extract data với fallback values
  const packageName = pkg.ten_hang_ve || pkg.goi_ve || "Gói vé";
  const price = pkg.gia_ve || pkg.gia || 0;
  
  // Baggage info
  const carryOnWeight = pkg.so_kg_hanh_ly_xach_tay || 0;
  const checkedWeight = pkg.so_kg_hanh_ly_ky_gui || 0;
  
  // Policies
  const isRefundable = pkg.refundable || false;
  const isChangeable = pkg.changeable || false;
  
  // Seat info
  const seatSpacing = pkg.khoang_cach_ghe || "Tiêu chuẩn";
  const seatSize = pkg.so_do_ghe || "Tiêu chuẩn";

  // Format currency
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // 🔥 Handle package selection
  const handleChoose = () => {
    if (onChoose) {
      onChoose(pkg);
    }
  };

  // 🔥 Handle show more detail
  const handleShowMore = (e) => {
    e.stopPropagation();
    if (onShowMoreDetail) {
      onShowMoreDetail(pkg);
    }
  };

  return (
    <div className="min-w-[280px] max-w-[300px] bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{packageName}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatPrice(price)}</div>
            <div className="text-sm opacity-90">/ khách</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Baggage Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 5a1 1 0 100 2h1v1H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-5V6h1a1 1 0 100-2H8z"/>
            </svg>
            Hành lý
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Xách tay:</span>
              <span className="font-medium">{carryOnWeight}kg</span>
            </div>
            <div className="flex justify-between">
              <span>Ký gửi:</span>
              <span className="font-medium">{checkedWeight}kg</span>
            </div>
          </div>
        </div>

        {/* Seat Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            Chỗ ngồi
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Khoảng cách:</span>
              <span className="font-medium">{seatSpacing}</span>
            </div>
            <div className="flex justify-between">
              <span>Kích thước:</span>
              <span className="font-medium">{seatSize}</span>
            </div>
          </div>
        </div>

        {/* Policies Section */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Chính sách
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Hoàn tiền:</span>
              <span className={`font-medium ${isRefundable ? 'text-green-600' : 'text-red-600'}`}>
                {isRefundable ? '✓ Có' : '✗ Không'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đổi vé:</span>
              <span className={`font-medium ${isChangeable ? 'text-green-600' : 'text-red-600'}`}>
                {isChangeable ? '✓ Có' : '✗ Không'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {/* More Details Button */}
        <button
          onClick={handleShowMore}
          className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200 border border-blue-200 rounded-lg py-2 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
        >
          Xem thêm chi tiết
        </button>

        {/* 🔥 CHOOSE BUTTON - MAIN ACTION */}
        <button
          onClick={handleChoose}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
        >
          🎫 Chọn gói này
        </button>
      </div>
    </div>
  );
};

export default React.memo(TicketPackageCard);