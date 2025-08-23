import { useEffect, useRef, useState, useCallback } from "react";
import dayjs from "dayjs";

export const useTicketOptionsPanel = (flight, packages = []) => {
  const optionListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Đổi giờ UTC sang VN (+7)
  const gioDiVN = flight?.thoi_gian_di
    ? dayjs(flight.thoi_gian_di).subtract(7, "hour")
    : null;
  const gioDenVN = flight?.thoi_gian_den
    ? dayjs(flight.thoi_gian_den).subtract(7, "hour")
    : null;

  // Kiểm tra trạng thái scroll
  const checkScroll = useCallback(() => {
    const el = optionListRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  // Scroll trái/phải + cập nhật arrows mượt hơn
  const scrollLeft = useCallback(() => {
    if (!optionListRef.current) return;
    optionListRef.current.scrollBy({ left: -300, behavior: "smooth" });
    requestAnimationFrame(checkScroll);
  }, [checkScroll]);

  const scrollRight = useCallback(() => {
    if (!optionListRef.current) return;
    optionListRef.current.scrollBy({ left: 300, behavior: "smooth" });
    requestAnimationFrame(checkScroll);
  }, [checkScroll]);

  // Gắn listener scroll và resize
  useEffect(() => {
    const el = optionListRef.current;
    if (!el) return;

    let timeout;
    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkScroll, 50);
    };

    el.addEventListener("scroll", handler);
    window.addEventListener("resize", checkScroll);

    // Check ngay lần đầu
    requestAnimationFrame(checkScroll);

    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timeout);
    };
  }, [packages, checkScroll]);

  return {
    optionListRef,
    gioDiVN,
    gioDenVN,
    showLeftArrow,
    showRightArrow,
    scrollLeft,
    scrollRight,
    checkScroll,
  };
};
