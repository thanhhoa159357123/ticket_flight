import React from "react";
import SearchIcon from "@mui/icons-material/Search";

const SearchButton = ({ handleSearch }) => (
  <div className="col-span-full flex justify-center md:justify-end mt-2 md:mt-2">
    <button
      className="flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 text-[0.875rem] md:text-[1rem] font-semibold bg-gradient-to-r from-[#7E96FF] to-[#E9C1FF] cursor-pointer text-white rounded-full transition shadow-[0_4px_15px_rgba(58,134,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(58,134,255,0.4)] w-full md:w-auto"
      onClick={handleSearch}
    >
      <SearchIcon className="text-[1rem] md:text-[1.25rem]" />
      <span className="whitespace-nowrap">Search Flights</span>
    </button>
  </div>
);

export default React.memo(SearchButton);
