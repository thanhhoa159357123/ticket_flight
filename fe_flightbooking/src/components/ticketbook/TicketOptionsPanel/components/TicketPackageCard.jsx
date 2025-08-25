import React from "react";

const TicketPackageCard = ({ pkg, onShowMoreDetail, onChoose }) => {
  // ✅ Extract data với fallback values
  const packageName = pkg.ten_hang_ve || pkg.goi_ve || "Gói vé";
  const price = pkg.gia_ve || pkg.gia || 0;

  // Baggage info
  const carryOnWeight = pkg.so_kg_hanh_ly_xach_tay || 0;
  const checkedWeight = pkg.so_kg_hanh_ly_ky_gui || 0;

  // Policies
  const isRefundable = pkg.refundable || false;
  // const isChangeable = pkg.changeable || false;

  // Seat info
  const seatSpacing = pkg.khoang_cach_ghe || "Tiêu chuẩn";
  const seatSize = pkg.so_do_ghe || "Tiêu chuẩn";

  // Format currency
  const formatPrice = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Handle actions
  const handleChoose = () => onChoose?.(pkg);
  const handleShowMore = (e) => {
    e.stopPropagation();
    onShowMoreDetail?.(pkg);
  };

  return (
    <div className="min-w-[280px] max-w-[300px] bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 rounded-t-2xl">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate">{packageName}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatPrice(price)}</div>
            <div className="text-xs opacity-80">/ khách</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Baggage */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              🧳
            </span>
            Hành lý
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
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

        {/* Seats */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              💺
            </span>
            Ghế ngồi
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
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

        {/* Policies */}
        <div className="space-y-1">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              📄
            </span>
            Chính sách
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Hoàn tiền:</span>
              <span
                className={`font-medium ${
                  isRefundable ? "text-green-600" : "text-red-500"
                }`}
              >
                {isRefundable ? "Có" : "Không"}
              </span>
            </div>
            {/* <div className="flex justify-between">
              <span>Đổi vé:</span>
              <span
                className={`font-medium ${
                  isChangeable ? "text-green-600" : "text-red-500"
                }`}
              >
                {isChangeable ? "Có" : "Không"}
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        <button
          onClick={handleShowMore}
          className="w-full text-sm text-blue-600 font-medium py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition"
        >
          Xem chi tiết
        </button>
        <button
          onClick={handleChoose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          🎫 Chọn gói này
        </button>
      </div>
    </div>
  );
};

export default React.memo(TicketPackageCard);
