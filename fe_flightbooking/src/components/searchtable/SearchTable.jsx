import React from "react";
import HeaderRow from "./HeaderRow";
import SingleTripInputs from "./SingleTripInputs";
import SearchButton from "./SearchButton";
import { useSearchTableData } from "../../hooks/hooksFindTicket/SearchTableHook";
import { useSearchContext } from "../../contexts/SearchContext";

const SearchTable = () => {
  const {
    from,
    setFrom,
    to,
    setTo,
    departureDate,
    setDepartureDate,
    returnDate,
    setReturnDate,
    selectedWay,
    selected,
    passengers,
    swapFromTo,
  } = useSearchContext();

  const {
    selectedLocation,
    isOneWay,
    isRoundTrip,
    handleSearch,
  } = useSearchTableData({
    selectedWay,
    selected,
    passengers,
    setFrom,
    setTo,
    from,
    to,
  });

  const handleSearchClick = () => {
    handleSearch(from, to);
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
        handleSwapLocation={swapFromTo}
        isRoundTrip={isRoundTrip}
      />

      <SearchButton handleSearch={handleSearchClick} />
    </div>
  );
};

export default SearchTable;
