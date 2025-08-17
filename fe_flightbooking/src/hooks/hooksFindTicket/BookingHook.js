// BookingHook.jsx
import { useState, useEffect, useCallback } from "react";
import {
  fetchSeatPositions,
  fetchTripTypes,
} from "../../services/servicesFindTicket/BookingService";

export const useBookingData = () => {
  const [options, setOptions] = useState([]);
  const [ways, setWays] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedWay, setSelectedWay] = useState("");
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });

  useEffect(() => {
    // Hàm lấy loại chuyến đi
    const loadWays = async () => {
      try {
        const res = await fetchTripTypes();
        // ✅ Filter out Multi City
        const types = res
          .map((item) => item.ten_chuyen_di)
          .filter((type) => type !== "Nhiều chặng");
        setWays(types);
        setSelectedWay(types[0] || "");
      } catch (err) {
        console.error("Lỗi fetch loại chuyến đi:", err);
      }
    };

    const loadOptions = async () => {
      try {
        const res = await fetchSeatPositions();
        // Lọc trước khi map để tránh lỗi logic
        const filtered = res.filter((item) => !item.ma_hang_ve.includes("+"));
        const unique = filtered
          .map((item) => item.ten_hang_ve)
          .filter((value, index, self) => self.indexOf(value) === index);
        setOptions(unique);
        setSelected(unique[0] || "");
      } catch (err) {
        console.error("Lỗi fetch vị trí ngồi:", err);
      }
    };
    loadOptions();
    loadWays();
  }, []);

  const handlePassengerInput = useCallback(
    (type, value) => {
      const numValue = parseInt(value) || 0;
      setPassengers((prev) => ({
        ...prev,
        [type]:
          type === "Adult" ? Math.max(1, numValue) : Math.max(0, numValue),
      }));
    },
    [setPassengers]
  );

  return {
    options,
    ways,
    selected,
    setSelected,
    selectedWay,
    setSelectedWay,
    passengers,
    handlePassengerInput,
  };
};
