import React from "react";
import AirlineFilter from "./items/AirlineFilter";
import Price_Ticket from "./items/Price_Ticket";

const SideBar_Filter = ({
  flights,
  selectedAirlines,
  setSelectedAirlines,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="w-72 min-w-[280px] p-4 sticky top-24 self-start bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
        <button 
          // onClick={handleReset}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Đặt lại
        </button>
      </div>

      <div className="space-y-3 mt-4">
        <AirlineFilter
          selectedAirlines={selectedAirlines}
          setSelectedAirlines={setSelectedAirlines}
        />
        
        <Price_Ticket
          flights={flights}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
      </div>
    </div>
  );
};

export default SideBar_Filter;