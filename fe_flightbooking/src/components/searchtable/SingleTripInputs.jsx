import React from "react";
import CustomDropdown from "./CustomDropdown";
import DateSelectorPopup from "./DateSelectorPopup";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const SingleTripInputs = ({
  from,
  setFrom,
  to,
  setTo,
  selectedLocation,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  isRoundTrip,
  handleSwapLocation,
}) => {
  const safeSelectedLocation = Array.isArray(selectedLocation) ? selectedLocation : [];

  return (
    <>
      {/* From Input */}
      <div className="flex items-center gap-2 md:gap-3 bg-[#f8f9fa] px-2 md:px-4 py-1 rounded-lg font-medium">
        <FlightTakeoffIcon className="text-[#3a86ff] text-[1rem] md:text-[1.25rem]" />
        <CustomDropdown 
          value={from} 
          onChange={setFrom} 
          options={safeSelectedLocation} 
          placeholder="Select departure"
          disabledValue={to}
        />
      </div>

      {/* To Input */}
      <div className="flex items-center gap-2 md:gap-3 bg-[#f8f9fa] px-2 md:px-4 py-1 rounded-lg font-medium">
        <div
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow cursor-pointer transition hover:bg-[#3a86ff] hover:text-white hover:rotate-180"
          onClick={handleSwapLocation}
        >
          <AutorenewIcon className="text-[0.875rem] md:text-[1rem]" />
        </div>
        <FlightLandIcon className="text-[#3a86ff] text-[1rem] md:text-[1.25rem]" />
        <CustomDropdown 
          value={to} 
          onChange={setTo} 
          options={safeSelectedLocation} 
          placeholder="Select arrival"
          disabledValue={from}
        />
      </div>

      {/* Date Selector - Full width on mobile, spans 2 cols on desktop */}
      <div className="col-span-1 md:col-span-2 cursor-pointer">
        <DateSelectorPopup
          departureDate={departureDate}
          setDepartureDate={setDepartureDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          isRoundTrip={isRoundTrip}
        />
      </div>
    </>
  );
};

export default React.memo(SingleTripInputs);
