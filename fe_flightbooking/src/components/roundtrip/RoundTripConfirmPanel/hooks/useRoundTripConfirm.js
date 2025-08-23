import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useRoundTripPackages from "./useRoundTripPackages";

export default function useRoundTripConfirm({
  show,
  onClose,
  selectedOutbound,
  selectedReturn,
  passengers,
  from,
  to,
  departureDate,
  returnDate,
}) {
  const navigate = useNavigate();

  // State chọn gói vé
  const [packageState, setPackageState] = useState({
    outbound: null,
    return: null,
    detail: null,
    showDetail: false,
  });

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch gói vé
  const { outboundPackages, returnPackages, loading } = useRoundTripPackages(
    show,
    selectedOutbound,
    selectedReturn
  );

  // Tổng số hành khách
  const getTotalPassengers = useCallback(
    () =>
      (passengers?.Adult || 0) +
      (passengers?.Children || 0) +
      (passengers?.Infant || 0),
    [passengers]
  );

  // Hiệu ứng animation khi mở/đóng
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 30);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  // Đóng panel mượt
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Điều hướng sang trang booking
  const handleConfirmBooking = useCallback(() => {
    if (!packageState.outbound || !packageState.return) {
      alert("Vui lòng chọn gói vé cho cả chuyến đi và chuyến về.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const maKhachHang = user?.ma_khach_hang;

    if (!maKhachHang) {
      alert("Bạn cần đăng nhập để tiếp tục.");
      return;
    }

    navigate("/booking", {
      state: {
        roundTrip: true,
        outboundFlight: selectedOutbound,
        returnFlight: selectedReturn,
        outboundPackage: packageState.outbound,
        returnPackage: packageState.return,
        passengers,
        from,
        to,
        departureDate,
        returnDate,
        loai_chuyen_di: "Khứ hồi",
        ma_khach_hang: maKhachHang,
      },
    });
  }, [
    packageState,
    selectedOutbound,
    selectedReturn,
    passengers,
    from,
    to,
    departureDate,
    returnDate,
    navigate,
  ]);

  return {
    packageState,
    setPackageState,
    outboundPackages,
    returnPackages,
    loading,
    isVisible,
    isAnimating,
    handleClose,
    handleConfirmBooking,
    getTotalPassengers,
  };
}
