import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isToday } from "date-fns";

const DateRangePicker = ({
  isSelectingReturn,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  numberOfMonths = 2,
  onClose
}) => {
  const handleSelect = (date) => {
    if (!date) return;
    
    if (isSelectingReturn) {
      setReturnDate(date);
    } else {
      setDepartureDate(date);
      setReturnDate(undefined); // reset return khi chọn lại ngày đi
    }
    
    // ✅ Đóng calendar sau khi chọn
    if (onClose) {
      setTimeout(() => onClose(), 100);
    }
  };

  const getTomorrow = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  };

  // ✅ Custom modifiers để highlight ngày hôm nay
  const modifiers = {
    today: (date) => isToday(date),
  };

  const modifiersStyles = {
    today: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      fontWeight: 'bold',
    }
  };

  return (
    <DayPicker
      key={isSelectingReturn ? "return" : "departure"}
      mode="single"
      selected={isSelectingReturn ? returnDate : departureDate}
      onSelect={handleSelect}
      numberOfMonths={numberOfMonths}
      defaultMonth={
        isSelectingReturn
          ? returnDate || departureDate || new Date()
          : departureDate || new Date()
      }
      disabled={
        isSelectingReturn && departureDate
          ? { before: getTomorrow(departureDate) }
          : { before: new Date() }
      }
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      className="text-[#0085E4]"
      styles={{
        months: {
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
        },
      }}
    />
  );
};

export default DateRangePicker;
