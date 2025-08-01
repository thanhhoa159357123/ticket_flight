import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { createBooking } from "../services/TicketOptionalsPanelService";
import { useNavigate } from "react-router-dom";

export const useTicketOptionsPanel = (flight, passengers) => {
  const navigate = useNavigate();
  const optionListRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const gioDiVN = flight?.gio_di
    ? dayjs(flight.gio_di).subtract(7, "hour")
    : null;
  const gioDenVN = flight?.gio_den
    ? dayjs(flight.gio_den).subtract(7, "hour")
    : null;

  const checkScroll = () => {
    if (optionListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = optionListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    optionListRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    // Sau khi scroll, kiểm tra lại sau 300ms
    setTimeout(checkScroll, 300);
  };

  const scrollRight = () => {
    optionListRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    // Sau khi scroll, kiểm tra lại sau 300ms
    setTimeout(checkScroll, 300);
  };

  useEffect(() => {
    const ref = optionListRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      // Thêm resize listener để xử lý khi kích thước thay đổi
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      ref?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    // Kiểm tra scroll ngay khi flight thay đổi
    checkScroll();

    // Và kiểm tra lại sau khi render xong (sử dụng double requestAnimationFrame)
    const animationFrame1 = requestAnimationFrame(() => {
      checkScroll();
    });

    return () => {
      cancelAnimationFrame(animationFrame1);
    };
  }, [flight]);

  const handleChoosePackage = async (pkg) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const maKhachHang = user?.ma_khach_hang;

    if (!maKhachHang) {
      alert("Bạn cần đăng nhập để đặt vé.");
      return;
    }

    const payload = {
      ngay_dat: new Date().toISOString().split("T")[0],
      trang_thai: "Chờ thanh toán",
      ma_khach_hang: maKhachHang,
      loai_chuyen_di: flight?.ma_chuyen_di,
      ma_hang_ve_di: pkg?.ma_hang_ve,
      ma_tuyen_bay_di: flight?.ma_tuyen_bay,
    };

    try {
      const datVe = await createBooking(payload);

      if (datVe?.ma_dat_ve) {
        navigate("/booking", {
          state: {
            flight,
            passengers,
            ma_dat_ve: datVe.ma_dat_ve,
            selected_package: pkg,
          },
        });
      } else {
        alert("Không thể đặt vé. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo đặt vé:", err);
      alert("Lỗi khi gửi dữ liệu đặt vé.");
    }
  };

  return {
    optionListRef,
    gioDiVN,
    gioDenVN,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
    handleChoosePackage,
    checkScroll,
  };
};
