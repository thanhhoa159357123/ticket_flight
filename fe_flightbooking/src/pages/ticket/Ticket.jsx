import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";
import { Tickets } from "../../hooks/TicketHook";

const Ticket = () => {
  const { flightResults, loading } = Tickets();

  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);

  const filteredFlights = flightResults.filter((flight) => {
    const airlineMatch =
      selectedAirlines.length === 0 || selectedAirlines.includes(flight.ten_hang_bay);
    const classMatch =
      selectedTicketTypes.length === 0 || selectedTicketTypes.includes(flight.ma_hang_ve);
    return airlineMatch && classMatch;
  });

  return (
    <>
      <Navbar />
      <div className="pt-[30px] flex items-start justify-center gap-[10px] w-full max-w-[1500px] mx-auto min-h-[calc(100vh-100px)]">
        <SideBar_Filter
          selectedAirlines={selectedAirlines}
          setSelectedAirlines={setSelectedAirlines}
          onSeatClassChange={setSelectedTicketTypes}
        />
        <div className="w-[1px] h-full bg-black/10 rounded-md" />
        <div className="flex-1 max-w-[800px]">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Đang tải dữ liệu...</p>
          ) : (
            <Ticket_Content flights={filteredFlights} />
          )}
        </div>
      </div>
    </>
  );
};

export default Ticket;
