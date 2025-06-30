import React from "react";

const Trip_Summary = () => {
  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Tóm tắt chuyến bay */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-base">Tóm tắt chuyến bay</h3>
          <a href="#" className="text-sm text-blue-600 hover:underline">Chi tiết</a>
        </div>

        <div className="text-sm bg-[#f9f9f9] border rounded px-3 py-2 mb-2">
          <div className="text-gray-600">Chuyến bay đi</div>
          <div className="font-medium">TP HCM (SGN)</div>
          <div className="text-xs text-gray-500">Th 4, 25 thg 6 2025 - 21:00</div>
          <div className="text-center my-2 text-xs text-gray-600">2h 10m<br />Bay thẳng</div>
          <div className="font-medium">Hà Nội (HAN)</div>
          <div className="text-xs text-gray-500">Th 4, 25 thg 6 2025 - 23:10</div>
        </div>

        <div className="text-sm">
          <p className="mb-1">✈️ VietJet Air</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Có ÁP DỤNG ĐỔI LỊCH BAY</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Có Thể Hoàn Vé</span>
          </div>
        </div>
      </div>

      {/* Tóm tắt giá */}
      <div className="bg-white border border-gray-300 rounded-md shadow-sm p-4">
        <h3 className="font-semibold mb-2">Tóm tắt</h3>
        <div className="flex justify-between text-sm">
          <span>Giá bạn trả</span>
          <span className="text-orange-600 font-semibold">2.423.078 VND</span>
        </div>
      </div>
    </div>
  );
};

export default Trip_Summary;
