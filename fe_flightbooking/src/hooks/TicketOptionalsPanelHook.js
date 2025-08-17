import { useEffect, useRef, useState, useCallback } from "react";
import dayjs from "dayjs";

export const useTicketOptionsPanel = (flight, passengers, packages = []) => {
  const optionListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // ✅ Sử dụng tên thuộc tính mới
  const gioDiVN = flight?.thoi_gian_di
    ? dayjs(flight.thoi_gian_di).subtract(7, "hour")
    : null;
    
  const gioDenVN = flight?.thoi_gian_den
    ? dayjs(flight.thoi_gian_den).subtract(7, "hour")
    : null;

  // 🆕 Optimize checkScroll với useCallback
  const checkScroll = useCallback(() => {
    if (optionListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = optionListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // 🆕 Cải thiện scroll functions với immediate feedback
  const scrollLeft = useCallback(() => {
    if (!optionListRef.current) return;
    
    const { scrollLeft: currentScroll } = optionListRef.current;
    const newScrollPosition = Math.max(0, currentScroll - 300);
    
    // 🔥 Update arrows ngay lập tức cho responsive feel
    if (newScrollPosition <= 0) {
      setShowLeftArrow(false);
    }
    if (!showRightArrow) {
      setShowRightArrow(true);
    }
    
    optionListRef.current.scrollTo({ 
      left: newScrollPosition, 
      behavior: "smooth" 
    });
    
    // 🔥 Debounced check sau khi animation hoàn thành
    setTimeout(checkScroll, 350);
  }, [checkScroll, showRightArrow]);

  const scrollRight = useCallback(() => {
    if (!optionListRef.current) return;
    
    const { scrollLeft: currentScroll, scrollWidth, clientWidth } = optionListRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const newScrollPosition = Math.min(maxScroll, currentScroll + 300);
    
    // 🔥 Update arrows ngay lập tức cho responsive feel
    if (newScrollPosition >= maxScroll) {
      setShowRightArrow(false);
    }
    if (!showLeftArrow) {
      setShowLeftArrow(true);
    }
    
    optionListRef.current.scrollTo({ 
      left: newScrollPosition, 
      behavior: "smooth" 
    });
    
    // 🔥 Debounced check sau khi animation hoàn thành
    setTimeout(checkScroll, 350);
  }, [checkScroll, showLeftArrow]);

  // 🆕 Throttled scroll event handler
  const throttledCheckScroll = useCallback(() => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScroll, 100);
    };
  }, [checkScroll]);

  useEffect(() => {
    const ref = optionListRef.current;
    const throttledHandler = throttledCheckScroll();
    
    if (ref) {
      ref.addEventListener("scroll", throttledHandler);
      window.addEventListener("resize", checkScroll);
    }
    
    return () => {
      ref?.removeEventListener("scroll", throttledHandler);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, throttledCheckScroll]);

  // 🆕 Effect để check scroll khi packages thay đổi
  useEffect(() => {
    // Multiple checks để đảm bảo accuracy
    const timeouts = [
      setTimeout(checkScroll, 0),
      setTimeout(checkScroll, 100),
      setTimeout(checkScroll, 300),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [packages, checkScroll]);

  useEffect(() => {
    // Kiểm tra scroll ngay khi flight thay đổi
    checkScroll();

    // Và kiểm tra lại sau khi render xong
    const animationFrame1 = requestAnimationFrame(() => {
      checkScroll();
    });

    return () => {
      cancelAnimationFrame(animationFrame1);
    };
  }, [flight, checkScroll]);

  // ✅ Bỏ phần tạo đặt vé - chỉ return basic handler
  const handleChoosePackage = (pkg) => {
    console.log("📦 Package selected from hook:", pkg);
    // Hook chỉ log, logic xử lý sẽ ở component
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
    packages, // ✅ Return packages từ props
  };
};
