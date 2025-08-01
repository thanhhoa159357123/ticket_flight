import React from "react";

const SeatPositionSelector = React.memo(({ options, selected, setSelected }) => {
  return (
    <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-2 gap-1 w-full justify-center lg:w-auto lg:justify-start">
      {options.length > 0 ? (
        options.map((option) => (
          <button
            key={option}
            className={`px-2 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer flex-1 lg:flex-none lg:px-4 lg:py-2 ${
              selected === option
                ? "bg-gradient-to-r from-[#7E96FF] to-[#BCAAFF] text-white shadow-[0_4px_12px_rgba(156,156,255,0.4)]"
                : "hover:bg-[#e9ecef] text-[#017EBE]"
            }`}
            onClick={() => setSelected(option)}
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

export default SeatPositionSelector;
