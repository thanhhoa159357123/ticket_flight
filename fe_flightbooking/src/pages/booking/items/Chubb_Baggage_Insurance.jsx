import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Chubb_Baggage_Insurance = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-start justify-between shadow-sm mt-4">
      {/* Left: Icon + Nội dung */}
      <div className="flex gap-3">
        {/* Icon */}
        <img
          src="https://ik.imagekit.io/tvlk/image/imageResource/2023/05/25/1685000917070-1dc6d9588f6fb258897d0583cfbb7f36.png?tr=h-48,q-75,w-48"
          alt="Chubb Baggage Insurance"
          className="w-12 h-12 object-contain"
        />

        {/* Nội dung */}
        <div className="space-y-1">
          <div className="font-semibold text-base">Bảo hiểm Hành lý Chubb</div>
          <div className="text-[#f97316] font-medium text-sm">
            VND16.000 <span className="text-gray-700 font-normal">/khách</span>
          </div>

          <ul className="list-none text-sm text-gray-700 mt-2 space-y-1">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="text-blue-500 text-[18px] mt-[2px]" />
              Bảo hiểm hành lý thất lạc hoặc hư hỏng lên đến 20,000,000 đồng
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="text-blue-500 text-[18px] mt-[2px]" />
              Bảo hiểm mỗi hành lý thất lạc hoặc hư hỏng lên đến 3,000,000 đồng
            </li>
          </ul>

          <a href="#" className="text-sm text-blue-600 hover:underline font-medium block mt-1">
            Tìm hiểu thêm
          </a>
        </div>
      </div>

      {/* Checkbox giả lập */}
      <div className="mt-1">
        <div className="w-5 h-5 border border-gray-400 rounded-sm"></div>
      </div>
    </div>
  );
};

export default Chubb_Baggage_Insurance;
