import React from "react";

const FilterContent = ({ onSearchAgain }) => {
  return (
    <div className="w-full">
      <button
        onClick={onSearchAgain}
        className="bg-blue-600 hover:bg-blue-700 hover:translate-y-0.5 active:translate-y-0 w-[100%] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out"
      >
        🔍 Tìm chuyến bay khác
      </button>
    </div>
  );
};

export default FilterContent;
