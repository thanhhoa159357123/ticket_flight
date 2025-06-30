import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import SearchTable from "./SearchTable";

const Booking = () => {
  const options = ["Economy", "Business", "First Class"];
  const ways = ["One way / Round trip", "Multi City"];
  const people = [
    { type: "Adult", icon: <PersonIcon /> },
    { type: "Children", icon: <ChildCareIcon /> },
    { type: "Infant", icon: <BabyChangingStationIcon /> },
  ];

  const [selected, setSelected] = useState(options[0]);
  const [selectedWay, setSelectedWay] = useState(ways[0]);
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });
  const [multiCityRoutes, setMultiCityRoutes] = useState([
    { from: "Ho Chi Minh (SGN)", to: "Hanoi (HAN)", departure: "11 May 2025" },
  ]);
  const [returnDate, setReturnDate] = useState(true);

  const handlePassengerInput = (type, value) => {
    // Nếu value là chuỗi rỗng (khi xóa hết nội dung)
    if (value === "") {
      // Nếu là Adult thì set về 1, các loại khác set về 0
      const defaultValue = type === "Adult" ? 1 : 0;
      setPassengers((prev) => ({
        ...prev,
        [type]: defaultValue,
      }));
    } else {
      // Xử lý giá trị số bình thường
      const numValue = parseInt(value) || 0;
      setPassengers((prev) => ({
        ...prev,
        [type]: Math.max(0, numValue),
      }));
    }
  };

  const addMultiCityRoute = () => {
    setMultiCityRoutes([
      ...multiCityRoutes,
      { from: "", to: "", departure: "" },
    ]);
  };

  const removeMultiCityRoute = (index) => {
    if (multiCityRoutes.length > 1) {
      const updatedRoutes = [...multiCityRoutes];
      updatedRoutes.splice(index, 1);
      setMultiCityRoutes(updatedRoutes);
    }
  };

  return (
    <div className="flex justify-center items-center w-full py-[1rem] bg-[linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)]">
      <div className="bg-[#fff] rounded-md p-[2rem] w-[100%] max-w-[1700px] shadow-md">
        <div className="flex flex-wrap gap-[1rem] mb-[1.2rem]">
          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] gap-[0.5rem]">
            {ways.map((option) => (
              <button
                key={option}
                className={`px-5 py-3 text-[1.2rem] font-medium rounded-full border-none bg-none transition-all duration-300 ease-in-out cursor-pointer 
      ${
        selectedWay === option
          ? "bg-[#3a86ff] text-white shadow-[0_4px_12px_rgba(58,134,255,0.3)]"
          : "hover:bg-[#e9ecef]"
      }`}
                onClick={() => setSelectedWay(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] gap-[0.5rem]">
            {options.map((option) => (
              <button
                key={option}
                className={`px-5 py-3 text-[1.2rem] font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer 
      ${
        selected === option
          ? "bg-[#8338ec] text-white shadow-[0_4px_12px_rgba(131,56,236,0.3)]"
          : "hover:bg-[#e9ecef]"
      }`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] ml-auto gap-[1rem]">
            {people.map(({ type, icon }) => (
              <div className="flex items-center gap-[0.5rem]" key={type}>
                <span className="flex items-center gap-1 text-[1.2rem] font-medium text-[#495057] whitespace-nowrap">
                  {icon} {type}
                </span>
                <div className="flex items-center border border-[#dee2e6] rounded-lg overflow-hidden h-7">
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-[#f8f9fa] text-[#6c757d] font-bold hover:bg-[#e9ecef] transition"
                    onClick={() =>
                      handlePassengerInput(type, passengers[type] - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={passengers[type] === 0 ? "" : passengers[type]}
                    onChange={(e) => handlePassengerInput(type, e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        const defaultValue = type === "Adult" ? 1 : 0;
                        handlePassengerInput(type, defaultValue);
                      }
                    }}
                    placeholder={type === "Adult" ? "1" : "0"}
                    className="w-9 min-w-[36px] h-7 text-center border-x border-[#dee2e6] font-medium appearance-none outline-none"
                  />
                  <button
                    className="w-7 h-7 flex items-center justify-center bg-[#f8f9fa] text-[#6c757d] font-bold hover:bg-[#e9ecef] transition"
                    onClick={() =>
                      handlePassengerInput(type, passengers[type] + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SearchTable
          selectedWay={selectedWay}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          multiCityRoutes={multiCityRoutes}
          removeMultiCityRoute={removeMultiCityRoute}
          addMultiCityRoute={addMultiCityRoute}
        />
      </div>
    </div>
  );
};

export default Booking;
