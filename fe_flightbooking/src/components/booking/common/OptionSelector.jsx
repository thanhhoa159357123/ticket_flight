import React, { useCallback } from "react";

/**
 * Component chọn option (dùng chung cho loại chuyến và hạng ghế)
 * @param {Array} options - Danh sách các lựa chọn
 * @param {String} selected - Giá trị đang được chọn
 * @param {Function} setSelected - Hàm set giá trị
 */
const OptionSelector = React.memo(({ options, selected, setSelected }) => {
  const handleClick = useCallback(
    (option) => {
      if (option !== selected) setSelected(option);
    },
    [selected, setSelected]
  );

  return (
    <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-2 gap-1 w-full justify-center lg:w-auto lg:justify-start">
      {options.length > 0 ? (
        options.map((option) => (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={`px-2 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer flex-1 lg:flex-none lg:px-4 lg:py-2 ${
              selected === option
                ? "bg-gradient-to-r from-[#4A8DFF] to-[#BCAAFF] text-white shadow-[0_4px_12px_rgba(156,156,255,0.4)]"
                : "hover:bg-[#e9ecef] text-[#017EBE]"
            }`}
          >
            {option}
          </button>
        ))
      ) : (
        <span className="px-3 py-2 text-sm md:text-base text-[#6c757d]">Đang tải...</span>
      )}
    </div>
  );
});

export default OptionSelector;
