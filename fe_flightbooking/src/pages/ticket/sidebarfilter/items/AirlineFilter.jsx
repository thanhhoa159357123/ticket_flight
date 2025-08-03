import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";

const AirlineFilter = ({ selectedAirlines, setSelectedAirlines }) => {
  const [isAirlineOpen, setIsAirlineOpen] = useState(true);
  const [allAirlines, setAllAirlines] = useState([]);

  const toggleAirline = (name) => {
    setSelectedAirlines((prev) =>
      prev.includes(name)
        ? prev.filter((airline) => airline !== name)
        : [...prev, name]
    );
  };

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/hang-bay");
        const fetchedAirlines = response.data.map((item) => item.ten_hang_bay);
        setAllAirlines(fetchedAirlines);
        setSelectedAirlines(fetchedAirlines);
      } catch (error) {
        console.error("Error fetching airlines:", error);
      }
    };

    fetchAirlines();
  }, [setSelectedAirlines]);

  return (
    <div className="flex flex-col border-b border-black/10">
      <div
        className="flex justify-between items-center py-2 text-sm font-semibold text-[#222] cursor-pointer select-none transition hover:text-[#007bff]"
        onClick={() => setIsAirlineOpen(!isAirlineOpen)}
      >
        <span>Hãng hàng không</span>
        <KeyboardArrowUpIcon
          fontSize="small"
          className={`transition-transform duration-200 ease-in-out ${
            isAirlineOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <div
        className={`flex flex-col gap-[4px] overflow-hidden transition-all duration-200 ease-in-out ${
          isAirlineOpen
            ? "max-h-[300px] opacity-100 pt-1 pb-2"
            : "max-h-0 opacity-0"
        }`}
      >
        {allAirlines.map((airline, index) => (
          <div
            key={index}
            onClick={() => toggleAirline(airline)}
            className="flex items-center gap-2 px-1 py-[6px] rounded-md text-xs cursor-pointer transition hover:bg-[rgba(58,134,255,0.05)]"
          >
            <input
              type="checkbox"
              checked={selectedAirlines.includes(airline)}
              onChange={() => toggleAirline(airline)}
              onClick={(e) => e.stopPropagation()}
              className="w-3.5 h-3.5 accent-[#3a86ff] transition"
            />
            <span className="flex-1 text-[#111] font-medium">{airline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirlineFilter;
