import React from "react";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";

const DetailContent = () => {
  return (
    <div className="flex bg-[#ffffff] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-[24px] text-[#333] relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col items-center justify-between pr-[24px] min-w-[120px]">
        <div className="flex flex-col items-center mb-2">
          <strong className="text-[24px] font-bold text-[#2a4365]">20:05</strong>
          <span className="text-[24px] text-[#718096] mt-1">28 thg 5</span>
        </div>
        <div className="flex flex-col items-center mx-3 relative before:absolute before:content-[''] before:w-[1px] before:h-[20px] before:bg-[#e2e8f0] before:top-[-22px] after:absolute after:content-[''] after:w-[1px] after:h-[20px] after:bg-[#e2e8f0]after:bottom-[-22px]">
          <span className="text-[14px] text-[#4a5568] font-medium">2h 5m</span>
          <div className="text-[12px] bg-[#ebf8ff] text-[#3182ce] px-0.5 py-2 rounded-[12px] mt-1 font-medium">Bay thẳng</div>
        </div>
        <div className="flex flex-col items-center mb-2">
          <strong className="text-[24px] font-bold text-[#2a4365]">22:10</strong>
          <span className="text-[24px] text-[#718096] mt-1">28 thg 5</span>
        </div>
      </div>
      {/* Thêm div chứa đường kẻ dọc */}
      <div className="w-[1px] bg-[#e2e8f0] my-4"></div>
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col">
          <div>
            <strong className="text-[18px] text-[#2d3748 font-semibold]">TP HCM (SGN)</strong>
            <span className="block text-[14px] text-[#718096] mt-1">
              Sân bay Tân Sơn Nhất - Nhà ga 1
            </span>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-[10px] p-4 mx-3 border-[1px] border-solid border-[#cbd5e0]">
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center flex-wrap gap-[12px] mb-2">
              <span className="text-[18px] font-bold text-[#2c5282]">VietJet Air</span>
              <span className="text-[14px] font-medium text-[#ffffff] bg-[#38a169] px-1 py-2.5 rounded-[20px]">VJ-1176 - Khuyến mãi</span>
            </div>

            <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,_minmax(180px,_1fr))]">
              {/* Hàng 1 - Thông tin hành lý */}
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-[#f7fafc]">
                <LuggageIcon className="text-[#4a5568] !text-[20px] shrink-0" />
                <div>
                  <div className="text-[12px] text-[#718096] font-medium">Hành lý ký gửi</div>
                  <div className="text-[14px] font-semibold text-[#2d3748] mt-0.5">0 kg</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-[#f7fafc]">
                <WorkIcon className="text-[#4a5568] !text-[20px] shrink-0" />
                <div>
                  <div className="text-[12px] text-[#718096] font-medium">Hành lý xách tay</div>
                  <div className="text-[14px] font-semibold text-[#2d3748] mt-0.5">7 kg</div>
                </div>
              </div>

              {/* Hàng 2 - Thông tin máy bay */}
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-[#f7fafc]">
                <AirlinesIcon className="text-[#4a5568] !text-[20px] shrink-0" />
                <div>
                  <div className="text-[12px] text-[#718096] font-medium">Loại máy bay</div>
                  <div className="text-[14px] font-semibold text-[#2d3748] mt-0.5">Airbus A321</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-[#f7fafc]">
                <AirlineSeatReclineNormalIcon className="text-[#4a5568] !text-[20px] shrink-0" />
                <div>
                  <div className="text-[12px] text-[#718096] font-medium">Sơ đồ ghế</div>
                  <div className="text-[14px] font-semibold text-[#2d3748] mt-0.5">3-3</div>
                </div>
              </div>

              {/* Hàng 3 - Thông tin khác */}
              <div className="flex items-center gap-2.5 p-2 bg-white rounded-[8px] shadow-[0_2px_4px_rgba(0,0,0,0.05)] hover:bg-[#f7fafc]">
                <AirlineSeatLegroomReducedIcon className="text-[#4a5568] !text-[20px] shrink-0" />
                <div>
                  <div className="text-[12px] text-[#718096] font-medium">Khoảng cách ghế</div>
                  <div className="text-[14px] font-semibold text-[#2d3748] mt-0.5">
                    28" (dưới tiêu chuẩn)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <strong className="text-[18px] text-[#2d3748 font-semibold]">Hà Nội (HAN)</strong>
            <span className="block text-[14px] text-[#718096] mt-1">Sân bay Nội Bài - Nhà ga 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
