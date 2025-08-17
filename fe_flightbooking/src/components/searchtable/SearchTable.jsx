import React from "react";
import HeaderRow from "./HeaderRow";
import SingleTripInputs from "./SingleTripInputs";
import SearchButton from "./SearchButton";
import { useSearchTableData } from "../../hooks/hooksFindTicket/SearchTableHook";

const SearchTable = ({ selectedWay, selected, passengers, onSubmit }) => {
  const {
    selectedLocation,
    from,
    setFrom,
    to,
    setTo,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    handleSwapLocation,
    handleSearch,
  } = useSearchTableData();

  const isOneWay = selectedWay === "Một chiều";
  const isRoundTrip = selectedWay === "Khứ hồi";

  const handleSearchClick = () => {
    handleSearch(selectedWay, selected, passengers);
    if (onSubmit) onSubmit();
  };

  return (
    <div className="grid gap-4 items-center grid-cols-4">
      <HeaderRow isOneWay={isOneWay} />

      <SingleTripInputs
        from={from}
        to={to}
        setFrom={setFrom}
        setTo={setTo}
        selectedLocation={selectedLocation}
        departureDate={departureDate}
        returnDate={returnDate}
        setDepartureDate={setDepartureDate}
        setReturnDate={setReturnDate}
        handleSwapLocation={handleSwapLocation}
        isRoundTrip={isRoundTrip}
      />

      <SearchButton handleSearch={handleSearchClick} />
    </div>
  );
};

export default SearchTable;
