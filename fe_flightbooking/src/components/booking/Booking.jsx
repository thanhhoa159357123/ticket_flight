import React, { useCallback, useMemo } from "react";
import { useSearchContext } from "../../contexts/SearchContext";
import SearchTable from "../searchtable/SearchTable";
import TripTypeSelector from "./TripTypeSelector";
import SeatPositionSelector from "./SeatPositionSelector";
import PassengerSelector from "./PassengerSelector";

const Booking = ({ onSearchDone }) => {
  const {
    selectedWay,
    setSelectedWay,
    selected,
    setSelected,
    passengers,
    handlePassengerInput,
    validationError,
  } = useSearchContext();

  // ✅ Remove Multi City option
  const options = useMemo(() => ["Economy", "Premium Economy", "Business", "First Class"], []);
  const ways = useMemo(() => ["Một chiều", "Khứ hồi"], []);

  const memoizedSetSelected = useCallback((val) => {
    console.log("🎯 Setting seat class:", val);
    setSelected(val);
  }, [setSelected]);
  
  const memoizedSetSelectedWay = useCallback((val) => {
    console.log("🎯 Setting trip type:", val);
    setSelectedWay(val);
  }, [setSelectedWay]);
  
  const memoizedHandlePassengerInput = useCallback((type, val) => {
    console.log("🎯 Setting passenger:", type, val);
    handlePassengerInput(type, val);
  }, [handlePassengerInput]);

  const handleSearchSubmit = async () => {
    console.log("🔍 Search submitted from Booking");
    if (onSearchDone) onSearchDone();
  };

  return (
    <div className="flex justify-center items-center w-full py-[1rem]">
      <div className="bg-white rounded-md p-[2rem] w-full max-w-[1700px]">
        {/* ✅ Validation Error Display */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Có lỗi xảy ra</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          </div>
        )}

        {/* ✅ Trip Type & Options */}
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
            handlePassengerInput={memoizedHandlePassengerInput}
          />
        </div>

        {/* ✅ Search Table */}
        <div className="overflow-visible z-0">
          <SearchTable onSubmit={handleSearchSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Booking;