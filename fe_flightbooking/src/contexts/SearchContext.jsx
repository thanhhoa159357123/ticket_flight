// src/contexts/SearchContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset về đầu ngày
    return today;
  });
  const [returnDate, setReturnDate] = useState(null);

  const [selectedWay, setSelectedWay] = useState("Một chiều");
  const [selected, setSelected] = useState("Economy");
  const [validationError, setValidationError] = useState("");

  // ✅ Computed properties - removed isMultiCity
  const isOneWay = useMemo(() => selectedWay === "Một chiều", [selectedWay]);
  const isRoundTrip = useMemo(() => selectedWay === "Khứ hồi", [selectedWay]);

  // ✅ Fixed validation function
  const validateFromTo = (fromValue, toValue) => {
    if (!fromValue || !toValue) {
      setValidationError("");
      return true;
    }

    const fromCode =
      typeof fromValue === "string"
        ? fromValue
        : fromValue?.ma_san_bay || fromValue?.code;
    const toCode =
      typeof toValue === "string"
        ? toValue
        : toValue?.ma_san_bay || toValue?.code;

    if (
      fromCode &&
      toCode &&
      String(fromCode).trim().toUpperCase() ===
        String(toCode).trim().toUpperCase()
    ) {
      setValidationError("Nơi đi và nơi đến không được trùng nhau!");
      return false;
    }

    setValidationError("");
    return true;
  };

  // ✅ Enhanced setters with validation
  const setFromWithValidation = (value) => {
    setFrom(value);
    validateFromTo(value, to);
  };

  const setToWithValidation = (value) => {
    setTo(value);
    validateFromTo(from, value);
  };

  // ✅ Passenger functions
  const handlePassengerInput = (type, value) => {
    const numValue = parseInt(value) || 0;
    setPassengers((prev) => ({
      ...prev,
      [type]: type === "Adult" ? Math.max(1, numValue) : Math.max(0, numValue),
    }));
  };

  const getTotalPassengers = () => {
    return passengers.Adult + passengers.Children + passengers.Infant;
  };

  // ✅ Utility functions
  const resetSearch = () => {
    setFrom("");
    setTo("");
    setDepartureDate(
      (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })()
    );
    setReturnDate(null);
    setValidationError("");
  };

  const swapFromTo = () => {
    if (!from || !to) return;
    
    const tempFrom = from;
    const tempTo = to;
    
    setValidationError("");
    setFrom(tempTo);
    setTo(tempFrom);
  };

  // ✅ Search ready validation - removed multi-city logic
  const isSearchReady = useMemo(() => {
    if (validationError) return false;
    if (!from || !to || !departureDate) return false;
    if (isRoundTrip && !returnDate) return false;
    return true;
  }, [
    from,
    to,
    departureDate,
    returnDate,
    isRoundTrip,
    validationError,
  ]);

  return (
    <SearchContext.Provider
      value={{
        // ✅ Core search data
        from,
        setFrom: setFromWithValidation,
        to,
        setTo: setToWithValidation,
        departureDate,
        setDepartureDate,
        returnDate,
        setReturnDate,

        // ✅ Trip type & class
        selectedWay,
        setSelectedWay,
        selected,
        setSelected,

        // ✅ Passengers
        passengers,
        setPassengers,
        handlePassengerInput,
        getTotalPassengers,

        // ✅ Validation & helpers
        validationError,
        setValidationError,
        validateFromTo,
        isSearchReady,
        isOneWay,
        isRoundTrip,

        // ✅ Utilities
        resetSearch,
        swapFromTo,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearchContext = () => useContext(SearchContext);
