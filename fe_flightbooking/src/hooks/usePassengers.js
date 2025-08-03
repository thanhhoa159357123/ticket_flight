import { useState } from "react";

export const usePassengers = (initialPassengers) => {
  const convertToPassengerList = (passengerCount) => {
    const result = [];

    const createPassenger = (type, index) => ({
      danh_xung: "",
      ho_hanh_khach: "",
      ten_hanh_khach: "",
      dd: "",
      mm: "",
      yyyy: "",
      quoc_tich: "Việt Nam",
      loai: type,
      stt: index + 1,
    });

    const adults = passengerCount?.Adult || 0;
    const children = passengerCount?.Children || 0;
    const infants = passengerCount?.Infant || 0;

    for (let i = 0; i < adults; i++) {
      result.push(createPassenger("Adult", i));
    }
    for (let i = 0; i < children; i++) {
      result.push(createPassenger("Children", i));
    }
    for (let i = 0; i < infants; i++) {
      result.push(createPassenger("Infant", i));
    }

    return result;
  };

  const [passengerList, setPassengerList] = useState(
    Array.isArray(initialPassengers)
      ? initialPassengers
      : convertToPassengerList(initialPassengers)
  );

  const updatePassenger = (index, newData) => {
    const newList = [...passengerList];
    newList[index] = { ...newList[index], ...newData };
    setPassengerList(newList);
  };

  return {
    passengerList,
    updatePassenger,
  };
};