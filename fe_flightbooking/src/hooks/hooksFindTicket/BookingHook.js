import { useState, useEffect, useCallback } from "react";
import { fetchSeatPositions, fetchTripTypes } from "../../services/servicesFindTicket/bookingService";

export const useBookingData = () => {
  const [options, setOptions] = useState([]);
  const [ways, setWays] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedWay, setSelectedWay] = useState("");
  const [passengers, setPassengers] = useState({ Adult: 1, Children: 0, Infant: 0 });
  const [returnDate, setReturnDate] = useState(true);

  // ✅ Memo hóa handlePassengerInput để tránh re-render thừa
  const handlePassengerInput = useCallback((type, value) => {
    const num = parseInt(value, 10) || 0;
    setPassengers((prev) => ({
      ...prev,
      [type]: type === "Adult" ? Math.max(1, num) : Math.max(0, num),
    }));
  }, []);

  useEffect(() => {
    let isMounted = true; // ✅ Ngăn update state khi component đã unmount

    const fetchData = async () => {
      // Chạy song song 2 API để nhanh hơn
      const [tripTypes, seatPositions] = await Promise.all([
        fetchTripTypes(),
        fetchSeatPositions(),
      ]);

      if (!isMounted) return;

      // Lấy loại chuyến đi
      const types = tripTypes
        .map((item) => item.ten_chuyen_di)
        .filter((type) => type !== "Nhiều chặng");
      setWays(types);
      setSelectedWay(types[0] || "");

      // Lấy hạng vé duy nhất, loại bỏ mã có "+"
      const uniqueOptions = [...new Set(
        seatPositions
          .filter((item) => !item.ma_hang_ve.includes("+"))
          .map((item) => item.ten_hang_ve)
      )];
      setOptions(uniqueOptions);
      setSelected(uniqueOptions[0] || "");
    };

    fetchData();

    // Cleanup tránh memory leak khi unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    options,
    ways,
    selected,
    setSelected,
    selectedWay,
    setSelectedWay,
    passengers,
    handlePassengerInput,
    returnDate,
    setReturnDate,
  };
};
