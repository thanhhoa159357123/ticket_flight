import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Information_Customer from "./component/Information_Customer";
import Trip_Summary from "./component/Trip_Summary";
import Check_Information_Booking from "./component/Check_Information_Booking";
import ValidationAlert from "./component/ValidationAlert";

import { usePassengers } from "./hooks/usePassengers";
import { useBooking } from "./hooks/useBooking";
import { useBookingValidation } from "./hooks/useBookingValidation";

const Booking = () => {
  const location = useLocation();
  const state = location.state || {};

  const isRoundTrip = state.roundTrip === true;

  const outboundFlight = isRoundTrip ? state.outboundFlight : state.flight;
  const returnFlight = isRoundTrip ? state.returnFlight : null;
  const outboundPackage = isRoundTrip
    ? state.outboundPackage
    : state.selected_package;
  const returnPackage = isRoundTrip ? state.returnPackage : null;
  const passengers = state.passengers || 1;

  const { passengerList, updatePassenger } = usePassengers(passengers);
  const { handleBookingSubmit } = useBooking({
    isRoundTrip,
    outboundFlight,
    outboundPackage,
    returnFlight,
    returnPackage,
  });

  const {
    validationErrors,
    showValidationAlert,
    setShowValidationAlert,
    validatePassengerInfo,
  } = useBookingValidation();

  const [showPopUpCheckInformation, setShowPopUpCheckInformation] =
    useState(false);

  const handleContinueToPayment = () => {
    const errors = validatePassengerInfo(passengerList);
    if (errors.length > 0) {
      setShowValidationAlert(true);
      setTimeout(() => setShowValidationAlert(false), 5000);
      return;
    }
    setShowValidationAlert(false);
    setShowPopUpCheckInformation(true);
  };

  return (
    <>
      <ValidationAlert
        show={showValidationAlert}
        errors={validationErrors}
        onClose={() => setShowValidationAlert(false)}
      />

      <div className="flex justify-center gap-8 px-4 py-6">
        <div className="flex flex-col gap-4 max-w-3xl w-full">
          <Information_Customer
            passengers={passengerList}
            onChangePassenger={updatePassenger}
          />
        </div>

        <div className="self-start h-fit w-full max-w-sm sticky top-[90px]">
          <Trip_Summary
            flight={outboundFlight}
            returnFlight={returnFlight}
            isRoundTrip={isRoundTrip}
            selectedPackage={outboundPackage}
            returnPackage={returnPackage}
            passengers={passengerList}
          />
        </div>
      </div>

      <div className="w-full flex justify-center pb-5">
        <button
          onClick={handleContinueToPayment}
          className={`bg-[#007bff] text-white font-semibold px-6 py-3 rounded-[20px] transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#025cbd] ${
            showValidationAlert ? "bg-red-500 hover:bg-red-600" : ""
          }`}
        >
          {showValidationAlert
            ? "⚠️ Vui lòng kiểm tra thông tin"
            : "Tiếp tục đến phần thanh toán"}
        </button>
      </div>

      {showPopUpCheckInformation && (
        <Check_Information_Booking
          passengers={passengerList}
          flight={outboundFlight}
          returnFlight={returnFlight}
          selectedPackage={outboundPackage}
          returnPackage={returnPackage}
          onClose={() => setShowPopUpCheckInformation(false)}
          onConfirm={() => handleBookingSubmit(passengerList)}
        />
      )}
    </>
  );
};

export default Booking;
