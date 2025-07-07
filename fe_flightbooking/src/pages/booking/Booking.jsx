import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Information_Connect from "./items/Information_Connect";
import Information_Customer from "./items/Information_Customer";
import Trip_Summary from "./items/Trip_Summary";
import Flight_Essentials from "./items/Flight_Essentials";
import Flight_Delay_Insurance from "./items/Flight_Delay_Insurance";
import Chubb_Baggage_Insurance from "./items/Chubb_Baggage_Insurance";
import Select_Luggage_Weight from "./items/select_luggage_weight/Select_Luggage_Weight";
import Check_Information_Booking from "./items/Check_Information_Booking";

const Booking = () => {
  const [showPopUpSelectWeightLuggage, setShowPopUpSelectWeightLuggage] =
    useState(false);
  const [showPopUpCheckInformation, setShowPopUpCheckInformation] =
    useState(false);
  const [selectedLuggage, setSelectedLuggage] = useState(null);

  return (
    <>
      <Navbar />
      <div className="flex justify-center gap-8 px-4 py-6">
        {/* Cột trái */}
        <div className="flex flex-col gap-4 max-w-3xl w-full">
          <Information_Connect />
          <Information_Customer />
          <Flight_Essentials
            onClickSelectLuggage={() => setShowPopUpSelectWeightLuggage(true)}
            selectedLuggage={selectedLuggage}
          />
          <Flight_Delay_Insurance />
          <Chubb_Baggage_Insurance />
        </div>

        {/* Cột phải */}
        <div className="self-start h-fit w-full max-w-sm sticky top-[90px]">
          <Trip_Summary />
        </div>
      </div>

      {/* Nút giữa toàn trang */}
      <div className="w-full flex justify-center pb-5">
        <button
          onClick={() => setShowPopUpCheckInformation(true)}
          className="bg-[#007bff] text-white font-semibold px-6 py-3 rounded-[20px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#025cbd]"
        >
          Tiếp tục đến phần thanh toán
        </button>
      </div>

      {/* Popup */}
      {showPopUpCheckInformation && (
        <Check_Information_Booking
          onClose={() => setShowPopUpCheckInformation(false)}
        />
      )}

      {/* Popup */}
      {showPopUpSelectWeightLuggage && (
        <Select_Luggage_Weight
          onClose={() => setShowPopUpSelectWeightLuggage(false)}
          onSelect={(option) => {
            setSelectedLuggage(
              option.label === "Không có hành lý bổ sung" ? null : option
            );
            setShowPopUpSelectWeightLuggage(false);
          }}
        />
      )}
    </>
  );
};

export default Booking;
