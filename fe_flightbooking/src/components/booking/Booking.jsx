import React, { useMemo } from "react";
import SearchTable from "../searchtable/SearchTable";
import { useBookingData } from "../../hooks/hooksFindTicket/BookingHook";
import OptionSelector from "./common/OptionSelector";
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

  // ✅ Memo hóa props để giảm render SearchTable
  const searchTableProps = useMemo(
    () => ({
      selectedWay,
      selected,
      passengers,
    }),
    [selectedWay, selected, passengers]
  );

  return (
    <div className="flex justify-center items-center w-full py-[1rem]">
      <div className="bg-white rounded-md p-[2rem] w-full max-w-[1700px]">
        {/* Booking Controls */}
        <div className="flex flex-row justify-between gap-4 mb-[1.2rem]">
          {/* Chọn loại chuyến */}
          <OptionSelector
            options={ways}
            selected={selectedWay}
            setSelected={setSelectedWay}
          />
          {/* Chọn hạng ghế */}
          <OptionSelector
            options={options}
            selected={selected}
            setSelected={setSelected}
          />
          {/* Chọn hành khách */}
          <PassengerSelector
            passengers={passengers}
            handlePassengerInput={handlePassengerInput}
          />
        </div>

        {/* SearchTable */}
        <div className="overflow-visible z-0">
          <SearchTable {...searchTableProps} onSubmit={onSearchDone} />
        </div>
      </div>
    </div>
  );
};

export default Booking;
