import React, { useCallback } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";

const people = [
  { type: "Adult", icon: <PersonIcon fontSize="small" />, label: "Người lớn" },
  { type: "Children", icon: <ChildCareIcon fontSize="small" />, label: "Trẻ em" },
  { type: "Infant", icon: <BabyChangingStationIcon fontSize="small" />, label: "Em bé" },
];

const PassengerSelector = React.memo(({ passengers, handlePassengerInput }) => {
  const handleChange = useCallback(
    (type, value) => {
      handlePassengerInput(type, Number(value));
    },
    [handlePassengerInput]
  );

  return (
    <div className="bg-[#f8f9fa] rounded-[50px] p-2 w-full lg:w-auto">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
        {people.map(({ type, icon, label }) => (
          <div className="flex items-center justify-between lg:justify-start gap-2" key={type}>
            {/* Label */}
            <span className="flex items-center gap-1 text-sm lg:text-base font-medium text-[#017EBE]">
              {icon} <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{type}</span>
            </span>

            {/* Input và nút tăng giảm */}
            <div className="flex items-center border border-[#dee2e6] rounded-lg text-[#017EBE] overflow-hidden h-8">
              {/* Nút giảm */}
              <button
                aria-label={`Giảm ${label}`}
                disabled={type === "Adult" && passengers[type] <= 1}
                className={`w-6 h-6 flex items-center justify-center text-base font-bold transition
                  ${
                    type === "Adult" && passengers[type] <= 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef] cursor-pointer"
                  }`}
                onClick={() => handleChange(type, passengers[type] - 1)}
              >
                -
              </button>

              {/* Input */}
              <input
                aria-label={`Số lượng ${label}`}
                type="number"
                min={type === "Adult" ? 1 : 0}
                value={passengers[type]}
                onChange={(e) => handleChange(type, e.target.value)}
                className="w-8 h-6 text-center border-x border-[#dee2e6] text-[#017EBE] font-medium outline-none appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                  [-moz-appearance:textfield]"
              />

              {/* Nút tăng */}
              <button
                aria-label={`Tăng ${label}`}
                className="w-6 h-6 flex items-center justify-center bg-[#f8f9fa] text-[#017EBE] text-base font-bold hover:bg-[#e9ecef] transition cursor-pointer"
                onClick={() => handleChange(type, passengers[type] + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}, (prev, next) => {
  // So sánh từng field để tránh JSON.stringify
  return (
    prev.handlePassengerInput === next.handlePassengerInput &&
    prev.passengers.Adult === next.passengers.Adult &&
    prev.passengers.Children === next.passengers.Children &&
    prev.passengers.Infant === next.passengers.Infant
  );
});

export default PassengerSelector;
