// fe_flightbooking/src/hooks/useBooking.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/BookingPageService";

export const useBooking = (bookingState) => {
  const navigate = useNavigate();
  const [selectedLuggage, setSelectedLuggage] = useState(null);

  const handleBookingSubmit = async (passengerList) => {
    try {
      if (!bookingState.flight || !bookingState.selected_package) {
        alert("Thiếu thông tin chuyến bay hoặc gói vé. Vui lòng quay lại chọn lại.");
        return;
      }
      if (!passengerList || passengerList.length === 0) {
        alert("Vui lòng nhập thông tin hành khách.");
        return;
      }

      const result = await bookingService.processBooking({
        passengerList,
        selectedPackage: bookingState.selected_package,
        flight: bookingState.flight,
        returnFlight: bookingState.returnFlight,
        returnPackage: bookingState.returnPackage,
        isRoundTrip: bookingState.isRoundTrip || false,
      });

      navigate("/checkout", {
        state: {
          booking: {
            passengers: result.passengers,
            chiTietVeDat: result.chiTietVeDat,
            datVeOutbound: result.datVeOutbound,
            datVeReturn: result.datVeReturn,
            selectedPackage: bookingState.selected_package,
            flight: bookingState.flight,
            returnFlight: bookingState.returnFlight,
            returnPackage: bookingState.returnPackage,
            isRoundTrip: bookingState.isRoundTrip || false,
            selectedLuggage,
          },
        },
      });
    } catch (err) {
      console.error("❌ Lỗi xử lý đặt vé:", err);
      alert(
        err?.response?.data?.detail ||
        err?.message ||
        "Có lỗi xảy ra khi đặt vé. Vui lòng thử lại."
      );
    }
  };

  return {
    selectedLuggage,
    setSelectedLuggage,
    handleBookingSubmit,
  };
};
