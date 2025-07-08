import { useEffect, useRef, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { format } from "date-fns";
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

  return (
    <div
      className={`relative w-full`}
      ref={ref}
    >
      <div
        className={`flex border border-gray-300 rounded-xl overflow-hidden divide-x bg-white w-full`}
      >
        <button
          onClick={() => toggleCalendar(false)}
          className={`flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition ${
            isRoundTrip ? "w-1/2" : "w-full"
          }`}
        >
          <CalendarMonthIcon className="text-[#3a86ff]" />
          <div className="text-left leading-tight">
            <div className="text-sm font-medium text-black">
              {departureDate
                ? format(departureDate, "dd 'thg' M yyyy", { locale: vi })
                : "Chọn ngày"}
            </div>
          </div>
        </button>

        {isRoundTrip && (
          <button
            onClick={() => toggleCalendar(true)}
            className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 transition w-1/2"
          >
            <CalendarMonthIcon className="text-[#3a86ff]" />
            <div className="text-left leading-tight">
              <div className="text-sm font-medium text-black">
                {returnDate
                  ? format(returnDate, "dd 'thg' M yyyy", { locale: vi })
                  : "Chọn ngày"}
              </div>
            </div>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border shadow-lg p-4 rounded-lg">
          <DateRangePicker
            isSelectingReturn={isSelectingReturn}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            returnDate={returnDate}
            setReturnDate={setReturnDate}
            onClose={handleClose}
            numberOfMonths={isRoundTrip ? 2 : 1}
          />
        </div>
      )}
    </div>
  );
};

export default DateSelectorPopup;
