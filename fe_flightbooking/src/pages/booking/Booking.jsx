import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Information_Customer from "./items/Information_Customer";
import Trip_Summary from "./items/Trip_Summary";
import Flight_Essentials from "./items/Flight_Essentials";
import Select_Luggage_Weight from "./items/select_luggage_weight/Select_Luggage_Weight";
import Check_Information_Booking from "./items/Check_Information_Booking";
import { usePassengers } from "../../hooks/usePassengers";
import { useBooking } from "../../hooks/useBooking";

const Booking = () => {
  const location = useLocation();
  const state = location.state || {};

  // Extract booking data
  const bookingData = {
    isRoundTrip: state.roundTrip || false,
    flight: state.flight || state.outboundFlight,
    returnFlight: state.returnFlight,
    selectedPackage: state.selected_package || state.outboundPackage,
    returnPackage: state.returnPackage,
    maDatVe: state.ma_dat_ve || state.ma_dat_ve_outbound,
    maDatVeReturn: state.ma_dat_ve_return,
  };

  console.log("🎫 Booking info:", bookingData);

  // Custom hooks
  const { passengerList, updatePassenger } = usePassengers(state.passengers);
  const { selectedLuggage, setSelectedLuggage, handleBookingSubmit } = useBooking(bookingData);

  // UI state
  const [showPopUpSelectWeightLuggage, setShowPopUpSelectWeightLuggage] = useState(false);
  const [showPopUpCheckInformation, setShowPopUpCheckInformation] = useState(false);

  const handleLuggageSelect = (option) => {
    setSelectedLuggage(option.label === "Không có hành lý bổ sung" ? null : option);
    setShowPopUpSelectWeightLuggage(false);
  };

  return (
    <>
      <div className="flex justify-center gap-8 px-4 py-6">
        {/* Main Content */}
        <div className="flex flex-col gap-4 max-w-3xl w-full">
          <Information_Customer
            passengers={passengerList}
            onChangePassenger={updatePassenger}
          />
          {/* <Flight_Essentials
            onClickSelectLuggage={() => setShowPopUpSelectWeightLuggage(true)}
            selectedLuggage={selectedLuggage}
          /> */}
        </div>

        {/* Sidebar */}
        <div className="self-start h-fit w-full max-w-sm sticky top-[90px]">
          <Trip_Summary
            flight={bookingData.flight}
            returnFlight={bookingData.returnFlight}
            isRoundTrip={bookingData.isRoundTrip}
            selectedPackage={bookingData.selectedPackage}
            returnPackage={bookingData.returnPackage}
            passengers={passengerList}
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className="w-full flex justify-center pb-5">
        <button
          onClick={() => setShowPopUpCheckInformation(true)}
          className="bg-[#007bff] text-white font-semibold px-6 py-3 rounded-[20px] 
            transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#025cbd]"
        >
          Tiếp tục đến phần thanh toán
        </button>
      </div>

      {/* Modals */}
      {showPopUpCheckInformation && (
        <Check_Information_Booking
          passengers={passengerList}
          isRoundTrip={bookingData.isRoundTrip}
          flight={bookingData.flight}
          returnFlight={bookingData.returnFlight}
          selectedPackage={bookingData.selectedPackage}
          returnPackage={bookingData.returnPackage}
          onClose={() => setShowPopUpCheckInformation(false)}
          onConfirm={() => handleBookingSubmit(passengerList)}
        />
      )}

      {showPopUpSelectWeightLuggage && (
        <Select_Luggage_Weight
          onClose={() => setShowPopUpSelectWeightLuggage(false)}
          onSelect={handleLuggageSelect}
        />
      )}
    </>
  );
};

export default Booking;
