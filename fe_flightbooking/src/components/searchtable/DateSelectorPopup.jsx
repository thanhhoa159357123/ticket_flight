import { useEffect, useRef, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { format, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DateSelectorPopup = ({
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  isRoundTrip,
}) => {
  const [open, setOpen] = useState(false);
  const [isSelectingReturn, setIsSelectingReturn] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCalendar = (selectingReturn = false) => {
    setIsSelectingReturn(selectingReturn);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ✅ Function để format ngày hiển thị - xử lý null
  const formatDisplayDate = (date) => {
    if (!date) return "Chọn ngày";

    if (isToday(date)) {
      return `${format(date, "dd 'thg' M yyyy")}`;
    }

    return format(date, "dd 'thg' M yyyy", { locale: vi });
  };

  return (
    <div className="relative w-full" ref={ref}>
      <div className="flex border border-gray-300 rounded-xl overflow-hidden divide-x bg-white w-full">
        <button
          onClick={() => toggleCalendar(false)}
          className={`flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer ${
            isRoundTrip ? "w-1/2" : "w-full"
          }`}
        >
          <CalendarMonthIcon className="text-[#017EBE] text-[1rem] md:text-[1.25rem]" />
          <div className="text-left leading-tight">
            <div className={`text-xs md:text-sm font-medium ${
              departureDate ? "text-[#017EBE]" : "text-gray-400"
            }`}>
              {formatDisplayDate(departureDate)}
            </div>
          </div>
        </button>

        {isRoundTrip && (
          <button
            onClick={() => toggleCalendar(true)}
            className="flex items-center gap-2 px-2 md:px-4 py-2 md:py-3 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer w-1/2"
          >
            <CalendarMonthIcon className="text-[#017EBE] text-[1rem] md:text-[1.25rem]" />
            <div className="text-left leading-tight">
              <div className={`text-xs md:text-sm font-medium ${
                returnDate ? "text-[#017EBE]" : "text-gray-400"
              }`}>
                {formatDisplayDate(returnDate)}
              </div>
            </div>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border shadow-lg p-2 md:p-4 rounded-lg left-0 right-0 md:left-auto md:right-auto">
          <DateRangePicker
            isSelectingReturn={isSelectingReturn}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            onClose={handleClose}
            numberOfMonths={isRoundTrip ? (window.innerWidth < 768 ? 1 : 2) : 1}
          />
        </div>
      )}
    </div>
  );
};

export default DateSelectorPopup;
