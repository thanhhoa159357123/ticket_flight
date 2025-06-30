import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Flight_Delay_Insurance = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-start justify-between shadow-sm">
      {/* Left: Icon + Nội dung */}
      <div className="flex gap-3">
        {/* Icon */}
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2025/05/06/1746529211970-63898d767be00f28e00054768e69b460.png?tr=h-48,q-75,w-48"
          alt="Delay Insurance"
          className="w-12 h-12 object-contain"
        />

        {/* Nội dung */}
        <div className="space-y-1">
          <div className="font-semibold text-base">
            Bảo hiểm Trì hoãn chuyến bay
          </div>
          <div className="text-[#f97316] font-medium text-sm">
            VND43.560 <span className="text-gray-700 font-normal">/khách</span>
          </div>

          <ul className="list-none text-sm text-gray-700 mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="text-blue-500 text-[18px] mt-[2px]" />
              Nhận 600.000 đồng nếu chuyến bay của bạn bị hoãn liên tục từ 180 phút trở lên
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="text-blue-500 text-[18px] mt-[2px]" />
              Quy trình nhận đền bù dễ dàng: bạn sẽ nhận được thông báo qua thư điện tử khi chuyến bay bị trì hoãn
            </li>
          </ul>

          <a href="#" className="text-sm text-blue-600 hover:underline font-medium block mt-1">
            Tìm hiểu thêm
          </a>
        </div>
      </div>

      {/* Checkbox giả lập góc phải */}
      <div className="mt-1">
        <div className="w-5 h-5 border border-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
};

export default Flight_Delay_Insurance;
