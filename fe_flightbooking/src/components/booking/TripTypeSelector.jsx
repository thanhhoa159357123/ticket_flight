import React from "react";

const TripTypeSelector = React.memo(({ ways, selectedWay, setSelectedWay }) => {
  return (
    <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-2 gap-1 w-full justify-center lg:w-auto lg:justify-start">
      {ways.map((way) => (
        <button
          key={way}
          className={`px-2 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer flex-1 lg:flex-none lg:px-4 lg:py-2 ${
            selectedWay === way
              ? "bg-gradient-to-r from-[#4A8DFF] to-[#BCAAFF] text-white shadow-[0_4px_12px_rgba(156,156,255,0.4)]"
              : "hover:bg-[#e9ecef] text-[#017EBE]"
          }`}
          onClick={() => setSelectedWay(way)}
        >
          {way}
        </button>
      ))}
    </div>
  );
});

export default TripTypeSelector;
