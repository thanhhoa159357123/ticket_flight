import React, { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const FilterContent = () => {
  const [isShowOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    "Ưu tiên bay thẳng",
    "Cất cánh sớm nhất",
    "Cất cánh muộn nhất",
    "Hạ cánh sớm nhất",
    "Hạ cánh muộn nhất",
  ];

  const toggleOptions = () => {
    setShowOptions(!isShowOptions);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  };

  return (
    <div className="w-full p-0 ml-4">
      <div className="flex justify-between max-w-[1200px] mx-auto gap-4">
        {/* Card 1 */}
        <div className="flex flex-col flex-1 bg-slate-50 border border-blue-500 rounded-xl p-4 shadow-md transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer relative hover:shadow-lg">
          <span className="text-[13px] text-slate-500 font-medium mb-1">
            Giá thấp nhất
          </span>
          <span className="text-[18px] font-bold text-slate-800 mb-1">
            1.813.410 VND
          </span>
          <span className="text-[13px] text-slate-500">2h 10m</span>
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-[12px] rounded-full flex items-center justify-center shadow-md">
            ✓
          </span>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col flex-1 bg-slate-50 border border-blue-500 rounded-xl p-4 shadow-md transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer relative hover:shadow-lg">
          <span className="text-[13px] text-slate-500 font-medium mb-1">
            Thời gian bay ngắn nhất
          </span>
          <span className="text-[18px] font-bold text-slate-800 mb-1">
            3.813.410 VND
          </span>
          <span className="text-[13px] text-slate-500">2h 0m</span>
        </div>

        {/* Dropdown Filter */}
        <div className="relative flex-1">
          <div
            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-md cursor-pointer transition-all duration-300"
            onClick={toggleOptions}
          >
            <div className="flex items-center w-full">
              <FilterAltIcon className="text-blue-500 mr-2 !text-[20px]" />
              <span className="text-[14px] font-medium text-slate-800 flex-grow">
                {selectedOption || "Khác"}
              </span>
              {isShowOptions ? (
                <ExpandLessIcon className="text-slate-400 !text-[20px]" />
              ) : (
                <ExpandMoreIcon className="text-slate-400 !text-[20px]" />
              )}
            </div>
          </div>

          {/* Smooth dropdown */}
          <div
            className={`
    absolute top-0 right-0 w-full z-50 bg-white rounded-xl shadow-lg overflow-hidden
    transition-all duration-300 ease-out transform
    ${
      isShowOptions
        ? "translate-y-[60px] opacity-100 pointer-events-auto"
        : "translate-y-0 opacity-0 pointer-events-none"
    }
  `}
            style={{ willChange: "transform, opacity" }}
          >
            {options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all border-b border-slate-200 last:border-none cursor-pointer ${
                  selectedOption === option
                    ? "bg-slate-50 text-blue-600 font-medium"
                    : ""
                }`}
                onClick={() => handleSelectOption(option)}
              >
                <span
                  className={`inline-block w-[6px] h-[6px] rounded-full mr-3 transition-all ${
                    selectedOption === option ? "bg-blue-600" : "bg-slate-300"
                  }`}
                ></span>
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;
