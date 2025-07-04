// SearchTable.jsx (đã fix tiêu đề Action cho Nhiều chặng)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";

const SearchTable = ({
  selectedWay,
  returnDate,
  setReturnDate,
  multiCityRoutes,
  removeMultiCityRoute,
  addMultiCityRoute,
}) => {
  const [from, setFrom] = useState("Ho Chi Minh (SGN)");
  const [to, setTo] = useState("Hanoi (HAN)");

  const handleSwapLocation = () => {
    setFrom(to);
    setTo(from);
  };

  const isOneWay = selectedWay === "Một chiều";
  const isRoundTrip = selectedWay === "Khứ hồi";
  const isMultiCity = selectedWay === "Nhiều chặng";

  return (
    <div className={`grid gap-4 items-center ${isMultiCity ? "grid-cols-4" : "grid-cols-4"}`}>
      {/* Tiêu đề */}
      {isMultiCity ? (
        <>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">From</div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">To</div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">Departure</div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">Action</div>
        </>
      ) : (
        <>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">From</div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">To</div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">Departure</div>
          <label className="flex items-center gap-2 text-[1.2rem] font-semibold text-[#6c757d] cursor-pointer">
            <input
              type="checkbox"
              checked={returnDate}
              onChange={() => setReturnDate(!returnDate)}
              className="w-[18px] h-[18px] accent-[#3a86ff] cursor-pointer"
            />
            <span>Return Date</span>
          </label>
        </>
      )}

      {/* Nội dung cho Một chiều / Khứ hồi */}
      {(isOneWay || isRoundTrip) && (
        <>
          <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
            <FlightTakeoffIcon className="text-[#3a86ff] text-[1.25rem]" />
            <span>{from}</span>
          </div>
          <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
            <div
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow cursor-pointer transition hover:bg-[#3a86ff] hover:text-white hover:rotate-180"
              onClick={handleSwapLocation}
            >
              <AutorenewIcon className="text-[1rem]" />
            </div>
            <FlightLandIcon className="text-[#3a86ff] text-[1.25rem]" />
            <span>{to}</span>
          </div>
          <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
            <CalendarMonthIcon className="text-[#3a86ff] text-[1.25rem]" />
            <span>11 May 2025</span>
          </div>

          {isRoundTrip && returnDate && (
            <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
              <CalendarMonthIcon className="text-[#3a86ff] text-[1.25rem]" />
              <span>19 May 2025</span>
            </div>
          )}
        </>
      )}

      {/* Nội dung cho Nhiều chặng */}
      {isMultiCity && (
        <>
          {multiCityRoutes.map((route, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
                <FlightTakeoffIcon className="text-[#3a86ff] text-[1.25rem]" />
                <span>{route.from || "Select city"}</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow cursor-pointer transition hover:bg-[#3a86ff] hover:text-white hover:rotate-180">
                  <AutorenewIcon className="text-[1rem]" />
                </div>
                <FlightLandIcon className="text-[#3a86ff] text-[1.25rem]" />
                <span>{route.to || "Select city"}</span>
              </div>
              <div className="flex items-center gap-3 bg-[#f8f9fa] p-4 rounded-xl font-medium cursor-pointer hover:bg-[#e9ecef]">
                <CalendarMonthIcon className="text-[#3a86ff] text-[1.25rem]" />
                <span>{route.departure || "Select date"}</span>
              </div>
              <div>
                {multiCityRoutes.length > 1 && (
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 cursor-pointer transition"
                    onClick={() => removeMultiCityRoute(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}

          <div className="col-span-4 flex justify-center my-4">
            <button
              className="flex items-center gap-2 px-6 py-3 bg-[#2ed573] text-white rounded-lg cursor-pointer font-medium hover:bg-[#30bb6a] transition"
              onClick={addMultiCityRoute}
            >
              <AddIcon /> Add Destination
            </button>
          </div>
        </>
      )}

      <div className="col-span-4 flex justify-end mt-2">
        <Link to="/flight-ticket">
          <button className="flex items-center gap-3 px-8 py-4 text-[1rem] font-semibold bg-gradient-to-r from-[#3a86ff] to-[#8338ec] cursor-pointer text-white rounded-full transition shadow-[0_4px_15px_rgba(58,134,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(58,134,255,0.4)]">
            <SearchIcon className="text-[1.25rem]" />
            Search Flights
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SearchTable;
