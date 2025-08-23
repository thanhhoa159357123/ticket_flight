import React, { useMemo } from "react";
import HeaderRow from "./HeaderRow";
import SingleTripInputs from "./SingleTripInputs";
import SearchButton from "./SearchButton";
import { useSearchTableData } from "../../hooks/hooksFindTicket/SearchTableHook";
import debounce from "lodash/debounce";

const SearchTable = React.memo(({ selectedWay, selected, passengers, onSubmit }) => {
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
    loading,
    error,
  } = useSearchTableData();

  const isOneWay = selectedWay === "Một chiều";
  const isRoundTrip = selectedWay === "Khứ hồi";

  // ✅ Memo hóa debounce, không tạo lại mỗi render
  const handleSearchClick = useMemo(
    () =>
      debounce(() => {
        handleSearch(selectedWay, selected, passengers);
        if (onSubmit) onSubmit();
      }, 500),
    [selectedWay, selected, passengers, handleSearch, onSubmit]
  );

  const isReady = Boolean(selectedWay && selected && passengers && from && to);

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

      <SearchButton
        handleSearch={handleSearchClick}
        disabled={!isReady || loading}
        loading={loading}
      />

      {error && <p className="col-span-4 text-red-500 text-sm">{error}</p>}
    </div>
  );
});

export default SearchTable;
