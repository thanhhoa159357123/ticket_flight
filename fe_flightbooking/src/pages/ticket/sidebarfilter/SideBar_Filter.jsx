// ✅ SideBar_Filter.jsx
import React from "react";
import AirlineFilter from "./items/AirlineFilter";

const SideBar_Filter = ({ flights, onChange }) => {
  const handleAirlineChange = (newAirlines) => {
    onChange(newAirlines);
  };

  return (
    <div className="w-72 min-w-[280px] p-4 sticky top-24 self-start bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>
      </div>
      <div className="space-y-3 mt-4">
        <AirlineFilter onChange={handleAirlineChange} />
      </div>
    </div>
  );
};

export default SideBar_Filter;

