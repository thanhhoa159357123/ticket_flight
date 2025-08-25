// fe_flightbooking/src/pages/booking/items/Check_Information_Booking.jsx
import React, { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Check_Information_Booking = ({ 
  onClose, 
  onConfirm, 
  passengers,
  flight,
  selectedPackage
}) => {
  
  const [animateIn, setAnimateIn] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    if (isConfirming) return;
    setAnimateIn(false);
    setTimeout(() => onClose(), 200);
  };

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
    } catch (error) {
      console.error("❌ Confirmation error:", error);
      setIsConfirming(false);
    }
  };

  if (!passengers || passengers.length === 0) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-10" onClick={handleClose}></div>
        <div className="fixed left-1/2 top-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Không có thông tin hành khách</h3>
            <p className="text-gray-600 mb-4">Vui lòng quay lại và nhập thông tin hành khách.</p>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" onClick={handleClose}></div>

      <div
        className={`fixed left-1/2 top-1/2 z-20 transform -translate-x-1/2 
            ${animateIn ? "-translate-y-1/2 opacity-100" : "translate-y-full opacity-0"}
            transition-all duration-300 ease-out
            bg-white rounded-2xl shadow-2xl w-full max-w-[900px] h-[700px] flex flex-col overflow-hidden`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 space-y-3">
            <h2 className="text-xl font-bold text-gray-900">
              Kiểm tra lại tên hành khách
            </h2>
            <p className="text-sm text-gray-600">
              Đảm bảo rằng các tên đã nhập là chính xác. Cách viết khác trên vé
              và ID có thể khiến hành khách không được phép lên chuyến bay.
            </p>
            <div className="flex items-center justify-start gap-2 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 rounded-md">
              <ErrorOutlineIcon className="text-amber-600 mt-0.5" />
              <p className="text-sm font-medium text-amber-800">
                Hãng hàng không này có thể không cho phép sửa tên
              </p>
            </div>
          </div>

          {/* 🔥 SIMPLIFIED: Flight Summary */}
          {flight && (
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Thông tin chuyến bay</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Chuyến đi:</span>
                  <span className="font-medium ml-2">
                    {flight.ma_san_bay_di || "N/A"} → {flight.ma_san_bay_den || "N/A"}
                  </span>
                </div>
                {selectedPackage && (
                  <div>
                    <span className="text-gray-600">Gói vé:</span>
                    <span className="font-medium ml-2">
                      {selectedPackage.ten_hang_ve || "Gói tiêu chuẩn"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Passenger Section */}
          <div className="px-6 py-5 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Danh sách hành khách ({passengers.length} người)
            </h3>
            
            {passengers.map((p, idx) => (
              <div key={idx} className="space-y-3 border border-gray-200 rounded-lg p-4">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold rounded-full px-3 py-1">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {p.danh_xung || ""} {p.ho_hanh_khach || ""} {p.ten_hanh_khach || ""}
                  </span>
                </div>

                {/* Info */}
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Họ (vd: Nguyen)</p>
                    <p className="font-semibold text-gray-800">
                      {p.ho_hanh_khach || "Chưa nhập"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tên Đệm & Tên</p>
                    <p className="font-semibold text-gray-800">
                      {p.ten_hanh_khach || "Chưa nhập"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Ngày sinh</p>
                    <p className="font-semibold text-gray-800">
                      {p.dd && p.mm && p.yyyy ? `${p.dd}/${p.mm}/${p.yyyy}` : "Chưa nhập"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Quốc tịch</p>
                    <p className="font-semibold text-gray-800">
                      {p.quoc_tich || "Chưa nhập"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Danh xưng</p>
                    <p className="font-semibold text-gray-800">
                      {p.danh_xung || "Chưa chọn"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
          <div className="text-sm text-gray-600">
            Kiểm tra kỹ thông tin trước khi xác nhận
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 min-w-[120px] font-semibold text-gray-700 bg-gray-100 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:bg-gray-200 disabled:opacity-50"
              onClick={handleClose}
              disabled={isConfirming}
            >
              Trở lại
            </button>
            <button
              className="px-6 py-2 min-w-[120px] font-semibold text-white bg-blue-600 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Check_Information_Booking;
