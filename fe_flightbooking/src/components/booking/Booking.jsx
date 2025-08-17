import React, { useCallback } from "react";
import SearchTable from "../searchtable/SearchTable";
import { useBookingData } from "../../hooks/hooksFindTicket/BookingHook";
import TripTypeSelector from "./TripTypeSelector";
import SeatPositionSelector from "./SeatPositionSelector";
import PassengerSelector from "./PassengerSelector";

const Booking = ({ onSearchDone }) => {
  const {
    ways,
    options,
    selected,
    selectedWay,
    setSelectedWay,
    setSelected,
    passengers,
    handlePassengerInput,
  } = useBookingData();

  const memoizedSetSelected = useCallback((val) => {
    setSelected(val);
  }, [setSelected]);
  
  const memoizedSetSelectedWay = useCallback((val) => {
    setSelectedWay(val);
  }, [setSelectedWay]);

  return (
    <div className="flex justify-center items-center w-full py-[1rem]">
      <div className="bg-white rounded-md p-[2rem] w-full max-w-[1700px]">
        {/* Booking Controls */}
        <div className="flex flex-row justify-between gap-4 mb-[1.2rem]">
          <TripTypeSelector
            ways={ways}
            selectedWay={selectedWay}
            setSelectedWay={memoizedSetSelectedWay}
          />
          <SeatPositionSelector
            options={options}
            selected={selected}
            setSelected={memoizedSetSelected}
          />
          <PassengerSelector
            passengers={passengers}
            handlePassengerInput={handlePassengerInput}
          />
        </div>

        {/* ✅ SearchTable với props ít hơn */}
        <div className="overflow-visible z-0">
          <SearchTable 
            selectedWay={selectedWay}
            selected={selected}
            passengers={passengers}
            onSubmit={onSearchDone}
          />
        </div>
      </div>
    </div>
  );
};

export default Booking;