import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";
import CustomDropdown from "./CustomDropdown";
import DateSelectorPopup from "./DateSelectorPopup";
import axios from "axios";

const SearchTable = ({
  selectedWay,
  selected,
  multiCityRoutes,
  setMultiCityRoutes,
  removeMultiCityRoute,
  addMultiCityRoute,
}) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const navigate = useNavigate();
  const [, setFlightResults] = useState([]);

  const isOneWay = selectedWay === "Một chiều";
  const isRoundTrip = selectedWay === "Khứ hồi";
  const isMultiCity = selectedWay === "Nhiều chặng";

  const handleSwapLocation = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/gia-ve/search-ve?from_airport=${from}&to_airport=${to}&loai_chuyen_di=${selectedWay}&vi_tri_ngoi=${selected}`
      );

      const data = await response.json();
      setFlightResults(data);
      navigate("/flight-ticket", { state: { results: data } });
    } catch (error) {
      console.error("Lỗi khi tìm vé:", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/san-bay");
        const locations = res.data.map((item) => ({
          name: item.ten_san_bay,
          code: item.ma_san_bay,
          display: `${item.ten_san_bay} - ${item.ma_san_bay}`,
        }));
        setSelectedLocation(locations);
        if (locations.length > 1) {
          setFrom(locations[0].code);
          setTo(locations[1].code);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="grid gap-4 items-center grid-cols-4">
      {isMultiCity ? (
        <>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            From
          </div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            To
          </div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            Departure
          </div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            Action
          </div>
        </>
      ) : (
        <>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            From
          </div>
          <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
            To
          </div>
          <div className="col-span-2 grid grid-cols-2">
            <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
              Departure
            </div>
            <div className="text-[1.2rem] font-semibold text-[#6c757d] uppercase tracking-wide mb-2">
              {!isOneWay && "Return Date"}
            </div>
          </div>
        </>
      )}

      {(isOneWay || isRoundTrip) && (
        <>
          <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-1 rounded-lg font-medium">
            <FlightTakeoffIcon className="text-[#3a86ff] text-[1.25rem]" />
            <CustomDropdown
              value={from}
              onChange={(val) => setFrom(val)}
              options={selectedLocation}
              placeholder="Select departure"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-1 rounded-lg font-medium">
            <div
              className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow cursor-pointer transition hover:bg-[#3a86ff] hover:text-white hover:rotate-180"
              onClick={handleSwapLocation}
            >
              <AutorenewIcon className="text-[1rem]" />
            </div>
            <FlightLandIcon className="text-[#3a86ff] text-[1.25rem]" />
            <CustomDropdown
              value={to}
              onChange={(val) => setTo(val)}
              options={selectedLocation}
              placeholder="Select arrival"
            />
          </div>

          <div className="col-span-2 cursor-pointer">
            <DateSelectorPopup
              departureDate={departureDate}
              setDepartureDate={setDepartureDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
              isRoundTrip={isRoundTrip}
            />
          </div>
        </>
      )}

      {isMultiCity && (
        <>
          {multiCityRoutes.map((route, index) => (
            <div className="col-span-4" key={index}>
              <div className="grid grid-cols-4 gap-4 items-start">
                <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-1 font-medium">
                  <FlightTakeoffIcon className="text-[#3a86ff] text-[1.25rem]" />
                  <CustomDropdown
                    value={route.from}
                    onChange={(val) => {
                      const updated = [...multiCityRoutes];
                      updated[index].from = val;
                      setMultiCityRoutes(updated);
                    }}
                    options={selectedLocation}
                    placeholder="From"
                  />
                </div>

                <div className="flex items-center gap-3 bg-[#f8f9fa] px-4 py-1 font-medium">
                  <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow cursor-pointer transition hover:bg-[#3a86ff] hover:text-white hover:rotate-180">
                    <AutorenewIcon className="text-[1rem]" />
                  </div>
                  <FlightLandIcon className="text-[#3a86ff] text-[1.25rem]" />
                  <CustomDropdown
                    value={route.to}
                    onChange={(val) => {
                      const updated = [...multiCityRoutes];
                      updated[index].to = val;
                      setMultiCityRoutes(updated);
                    }}
                    options={selectedLocation}
                    placeholder="To"
                  />
                </div>

                <DateSelectorPopup
                  departureDate={route.departureDate || null}
                  setDepartureDate={(date) => {
                    const updated = [...multiCityRoutes];
                    updated[index].departureDate = date;
                    setMultiCityRoutes(updated);
                  }}
                  returnDate={null}
                  setReturnDate={() => {}}
                  isRoundTrip={false}
                />

                <div className="flex items-center justify-start">
                  {multiCityRoutes.length > 1 && (
                    <button
                      className="bg-red-500 text-white py-3 px-4 rounded hover:bg-red-600 cursor-pointer transition"
                      onClick={() => removeMultiCityRoute(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
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
        <button
          className="flex items-center gap-3 px-8 py-4 text-[1rem] font-semibold bg-gradient-to-r from-[#3a86ff] to-[#8338ec] cursor-pointer text-white rounded-full transition shadow-[0_4px_15px_rgba(58,134,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(58,134,255,0.4)]"
          onClick={handleSearch}
        >
          <SearchIcon className="text-[1.25rem]" />
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default SearchTable;
