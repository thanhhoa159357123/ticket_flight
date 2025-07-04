// Booking.jsx
import React, { useState, useEffect } from "react";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import axios from "axios";
import SearchTable from "./SearchTable";

const Booking = () => {
  const people = [
    { type: "Adult", icon: <PersonIcon /> },
    { type: "Children", icon: <ChildCareIcon /> },
    { type: "Infant", icon: <BabyChangingStationIcon /> },
  ];
  const [options, setOptions] = useState([]);
  const [ways, setWays] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedWay, setSelectedWay] = useState("");
  const [selectedLoai, setSelectedLoai] = useState(null);
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });
  const [multiCityRoutes, setMultiCityRoutes] = useState([
    { from: "Ho Chi Minh (SGN)", to: "Hanoi (HAN)", departure: "11 May 2025" },
  ]);
  const [returnDate, setReturnDate] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/hang-ve");
        const uniqueOptions = res.data
          .map((item) => item.vi_tri_ngoi)
          .filter((value, index, self) => self.indexOf(value) === index); // loại trùng

        setOptions(uniqueOptions);
        setSelected(uniqueOptions[0] || "");
      } catch (error) {
        console.error("Lỗi fetch vị trí ngồi:", error);
      }
    };

    fetchOptions(); // <- gọi fetch
  }, []);

  useEffect(() => {
    const fetchWays = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/loai-chuyen-di"
        );
        const uniqueWays = res.data.map((item) => item.ten_chuyen_di);
        setWays(uniqueWays);
        setSelectedWay(uniqueWays[0] || "");
      } catch (error) {
        console.error("Lỗi fetch loại chuyến đi:", error);
      }
    };
    fetchWays();
  }, []);

  useEffect(() => {
    const fetchLoai = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/loai-chuyen-di"
        );
        const label = selectedWay === "Nhiều chặng" ? "Đa chặng" : selectedWay;
        const found = res.data.find((item) => item.ten_chuyen_di === label);
        setSelectedLoai(found || null);
      } catch (err) {
        console.error("Lỗi fetch loại:", err);
      }
    };
    if (selectedWay) fetchLoai();
  }, [selectedWay]);

  const handlePassengerInput = (type, value) => {
    const numValue = parseInt(value) || 0;
    setPassengers((prev) => ({ ...prev, [type]: Math.max(0, numValue) }));
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
    <div className="flex justify-center items-center w-full py-[1rem] bg-[linear-gradient(135deg,#f5f7fa_0%,#e4e8eb_100%)]">
      <div className="bg-white rounded-md p-[2rem] w-full max-w-[1700px] shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-start mb-[1.2rem]">
          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] gap-[0.5rem]">
            {ways.length > 0 ? (
              ways.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 text-[1rem] font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                    selectedWay === option
                      ? "bg-[#3a86ff] text-white shadow-[0_4px_12px_rgba(58,134,255,0.3)]"
                      : "hover:bg-[#e9ecef]"
                  }`}
                  onClick={() => setSelectedWay(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <span className="px-3 py-1 text-[1rem] text-[#6c757d]">
                Đang tải...
              </span>
            )}
          </div>

          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] gap-[0.5rem]">
            {options.length > 0 ? (
              options.map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 text-[1rem] font-medium rounded-full transition-all duration-300 ease-in-out cursor-pointer ${
                    selected === option
                      ? "bg-[#8338ec] text-white shadow-[0_4px_12px_rgba(131,56,236,0.3)]"
                      : "hover:bg-[#e9ecef]"
                  }`}
                  onClick={() => setSelected(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <span className="px-3 py-1 text-[1rem] text-[#6c757d]">
                Đang tải...
              </span>
            )}
          </div>

          <div className="flex items-center bg-[#f8f9fa] rounded-[50px] p-[0.5rem] ml-auto gap-[1rem]">
            {people.map(({ type, icon }) => (
              <div className="flex items-center gap-[0.5rem]" key={type}>
                <span className="flex items-center gap-1 text-[1rem] font-medium text-[#495057] whitespace-nowrap">
                  {icon} {type}
                </span>
                <div className="flex items-center border border-[#dee2e6] rounded-lg overflow-hidden h-8">
                  <button
                    className="w-6 h-6 flex items-center justify-center bg-[#f8f9fa] text-[#6c757d] text-base font-bold hover:bg-[#e9ecef] transition"
                    onClick={() =>
                      handlePassengerInput(type, passengers[type] - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={passengers[type]}
                    onChange={(e) => handlePassengerInput(type, e.target.value)}
                    placeholder={type === "Adult" ? "1" : "0"}
                    className="w-6 h-6 text-center border-x border-[#dee2e6] font-medium outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    className="w-6 h-6 flex items-center justify-center bg-[#f8f9fa] text-[#6c757d] text-base font-bold hover:bg-[#e9ecef] transition"
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
          selectedLoai={selectedLoai}
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
