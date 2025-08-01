import React, { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Check_Information_Booking = ({ onClose, onConfirm, passengers }) => {
  console.log(passengers);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => onClose(), 200); // Delay unmount để chờ animation kết thúc
  };
  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-10"
        onClick={handleClose}
      ></div>

      <div
        className={`
            fixed left-1/2 top-1/2 z-20 transform -translate-x-1/2 
            ${
              animateIn
                ? "-translate-y-1/2 opacity-100"
                : "translate-y-full opacity-0"
            }
            transition-all duration-300 ease-out
            bg-white rounded-2xl shadow-2xl w-full max-w-[900px] h-[700px] flex flex-col overflow-hidden
            `}
      >
        {/* Content Scrollable Area */}
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

          {/* Passenger Section */}
          <div className="px-6 py-5 space-y-4">
            {passengers.map((p, idx) => (
              <div key={idx} className="space-y-3">
                {/* Title */}
                <div className="flex items-center gap-3">
                  <span className="bg-gray-200 text-sm font-semibold rounded-full px-3 py-1">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {p.danh_xung || p.gioi_tinh || ""} {p.ho_hanh_khach}{" "}
                    {p.ten_hanh_khach}
                  </span>
                </div>

                {/* Info */}
                <div className="bg-gray-100 rounded-lg p-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Họ (vd: Nguyen)</p>
                    <p className="font-semibold text-gray-800">
                      {p.ho_hanh_khach}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tên Đệm & Tên</p>
                    <p className="font-semibold text-gray-800">
                      {p.ten_hanh_khach}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Ngày sinh</p>
                    <p className="font-semibold text-gray-800">{p.dd}/{p.mm}/{p.yyyy}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Quốc tịch</p>
                    <p className="font-semibold text-gray-800">{p.quoc_tich}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-4 bg-white">
          <button
            className="px-6 py-2 min-w-[120px] font-semibold text-gray-700 bg-gray-100 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:bg-gray-200"
            onClick={handleClose}
          >
            Trở lại
          </button>
          <button
            className="px-6 py-2 min-w-[120px] font-semibold text-white bg-blue-600 rounded-lg transition duration-300 ease-in-out cursor-pointer hover:bg-blue-700"
            onClick={onConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </>
  );
};

export default Check_Information_Booking;
