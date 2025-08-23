// fe_flightbooking/src/hooks/useBooking.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../../services/BookingPageService";

export const useBooking = (bookingState) => {
  const navigate = useNavigate();
  const [selectedLuggage, setSelectedLuggage] = useState(null);
  const handleBookingSubmit = async (passengerList) => {
    try {
      const isRoundTrip = bookingState.isRoundTrip === true;
      console.log("Booking State:", bookingState);
      console.log("Passenger List:", passengerList);
      const outboundFlight = bookingState.outboundFlight;
      const outboundPackage = bookingState.outboundPackage;
      const returnFlight = isRoundTrip ? bookingState.returnFlight : null;
      const returnPackage = isRoundTrip ? bookingState.returnPackage : null;
      console.log("outboundFlight:", outboundFlight);
      console.log("outboundPackage:", outboundPackage);
      if (!outboundFlight || !outboundPackage) {
        alert(
          "Thiếu thông tin chuyến bay hoặc gói vé. Vui lòng quay lại chọn lại."
        );
        return;
      }
      if (!passengerList || passengerList.length === 0) {
        alert("Vui lòng nhập thông tin hành khách.");
        return;
      }
      const result = await bookingService.processBooking({
        passengerList,
        selectedPackage: outboundPackage,
        flight: outboundFlight,
        returnFlight: returnFlight,
        returnPackage: returnPackage,
        isRoundTrip: isRoundTrip,
      });
      navigate("/checkout", {
        state: {
          booking: {
            passengers: result.passengers,
            chiTietVeDat: result.chiTietVeDat,
            datVeOutbound: result.datVeOutbound,
            datVeReturn: result.datVeReturn,
            selectedPackage: outboundPackage,
            flight: outboundFlight,
            returnFlight: returnFlight,
            returnPackage: returnPackage,
            isRoundTrip: isRoundTrip,
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
  return { selectedLuggage, setSelectedLuggage, handleBookingSubmit };
};
