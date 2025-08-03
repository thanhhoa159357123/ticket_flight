import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/BookingPageService";

export const useBooking = (bookingState) => {
  const navigate = useNavigate();
  const [selectedLuggage, setSelectedLuggage] = useState(null);

  const handleBookingSubmit = async (passengerList) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const maKhachHang = userData?.ma_khach_hang;

      if (!maKhachHang || !bookingState.flight) {
        alert("Thiếu thông tin đặt vé. Vui lòng quay lại chọn lại vé.");
        return;
      }

      if (!bookingState.maDatVe) {
        alert("Không tìm thấy thông tin đặt vé. Vui lòng thử lại.");
        return;
      }

      // Xử lý đặt vé
      const result = await bookingService.processBooking({
        passengerList,
        ...bookingState,
      });

      // Chuyển đến checkout
      navigate("/checkout", {
        state: {
          isRoundTrip: bookingState.isRoundTrip,
          dat_ve: { ma_dat_ve: bookingState.maDatVe },
          ...(bookingState.maDatVeReturn && {
            dat_ve_return: { ma_dat_ve: bookingState.maDatVeReturn },
          }),
          flight: bookingState.flight,
          selectedPackage: bookingState.selectedPackage,
          ...(bookingState.isRoundTrip && {
            returnFlight: bookingState.returnFlight,
            returnPackage: bookingState.returnPackage,
          }),
          passengers: result.passengers,
          chiTietVeDat: result.chiTietVeDat,
          ...(result.chiTietVeReturn.length > 0 && {
            chiTietVeReturn: result.chiTietVeReturn,
          }),
          selectedLuggage,
        },
      });
    } catch (err) {
      console.error("❌ Lỗi gửi thông tin:", err.response?.data || err.message);
      alert("Gửi thông tin đặt vé thất bại. Vui lòng thử lại.");
    }
  };

  return {
    selectedLuggage,
    setSelectedLuggage,
    handleBookingSubmit,
  };
};