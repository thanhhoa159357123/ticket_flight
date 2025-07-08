import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DateRangePicker = ({
  isSelectingReturn,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  numberOfMonths= 2
}) => {
  const handleSelect = (date) => {
    if (!date) return;
    if (isSelectingReturn) {
      setReturnDate(date);
    } else {
      setDepartureDate(date);
      setReturnDate(undefined); // reset return khi chọn lại ngày đi
    }
  };

  const getTomorrow = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
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
