import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";

const people = [
  { type: "Adult", icon: <PersonIcon />, label: "Người lớn" },
  { type: "Children", icon: <ChildCareIcon />, label: "Trẻ em" },
  { type: "Infant", icon: <BabyChangingStationIcon />, label: "Em bé" },
];

const PassengerSelector = React.memo(({ passengers, handlePassengerInput }) => {
  return (
    <div className="bg-[#f8f9fa] rounded-[50px] p-2 w-full lg:w-auto">
      {/* ✅ Mobile layout - vertical */}
      <div className="flex flex-col gap-2 lg:hidden">
        {people.map(({ type, icon, label }) => (
          <div className="flex items-center justify-between" key={type}>
            <span className="flex items-center gap-2 text-sm font-medium text-[#017EBE]">
              {icon}{" "}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{type}</span>
            </span>
            <div className="flex items-center border border-[#dee2e6] rounded-lg text-[#017EBE] overflow-hidden h-8">
              <button
                disabled={type === "Adult" && passengers[type] <= 1}
                className={`w-6 h-6 flex items-center justify-center cursor-pointer text-base text-[#017EBE] font-bold transition ${
                  type === "Adult" && passengers[type] <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]"
                }`}
                onClick={() => handlePassengerInput(type, passengers[type] - 1)}
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={passengers[type]}
                onChange={(e) => handlePassengerInput(type, e.target.value)}
                className="w-8 h-6 text-center border-x border-[#dee2e6] text-[#017EBE] font-medium outline-none appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
        [-moz-appearance:textfield]"
              />
              <button
                className="w-6 h-6 flex items-center justify-center cursor-pointer bg-[#f8f9fa] text-[#017EBE] text-base font-bold hover:bg-[#e9ecef] transition"
                onClick={() => handlePassengerInput(type, passengers[type] + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Desktop layout - horizontal */}
      <div className="hidden lg:flex items-center gap-4">
        {people.map(({ type, icon, label }) => (
          <div className="flex items-center gap-2" key={type}>
            <span className="flex items-center gap-1 text-base font-medium text-[#017EBE] whitespace-nowrap">
              {icon} {label}
            </span>
            <div className="flex items-center border border-[#dee2e6] rounded-lg text-[#017EBE] overflow-hidden h-8">
              <button
                disabled={type === "Adult" && passengers[type] <= 1}
                className={`w-6 h-6 flex items-center justify-center cursor-pointer text-base text-[#017EBE] font-bold transition ${
                  type === "Adult" && passengers[type] <= 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#f8f9fa] text-[#6c757d] hover:bg-[#e9ecef]"
                }`}
                onClick={() => handlePassengerInput(type, passengers[type] - 1)}
              >
                -
              </button>
              <input
                type="number"
                min="0"
                value={passengers[type]}
                onChange={(e) => handlePassengerInput(type, e.target.value)}
                className="w-6 h-6 text-center border-x border-[#dee2e6] text-[#017EBE] font-medium outline-none appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
        [&::-webkit-outer-spin-button]:appearance-none
        [-moz-appearance:textfield]"
              />
              <button
                className="w-6 h-6 flex items-center justify-center cursor-pointer bg-[#f8f9fa] text-[#017EBE] text-base font-bold hover:bg-[#e9ecef] transition"
                onClick={() => handlePassengerInput(type, passengers[type] + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PassengerSelector;
