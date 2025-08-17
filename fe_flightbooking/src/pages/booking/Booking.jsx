// fe_flightbooking/src/pages/booking/Booking.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Information_Customer from "./items/Information_Customer";
import Trip_Summary from "./items/Trip_Summary";
import Select_Luggage_Weight from "./items/select_luggage_weight/Select_Luggage_Weight";
import Check_Information_Booking from "./items/Check_Information_Booking";
import { usePassengers } from "../../hooks/usePassengers";
import { useBooking } from "../../hooks/useBooking";

const Booking = () => {
  const location = useLocation();
  const state = location.state || {};

  // 🔥 SIMPLE: Lấy data trực tiếp từ state
  const flight = state.flight;
  const selectedPackage = state.selected_package;
  const passengers = state.passengers || 1;

  // Custom hooks
  const { passengerList, updatePassenger } = usePassengers(passengers);
  const { selectedLuggage, setSelectedLuggage, handleBookingSubmit } = useBooking(
    state
  );

  // UI state
  const [showPopUpSelectWeightLuggage, setShowPopUpSelectWeightLuggage] =
    useState(false);
  const [showPopUpCheckInformation, setShowPopUpCheckInformation] =
    useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const handleLuggageSelect = (option) => {
    setSelectedLuggage(
      option.label === "Không có hành lý bổ sung" ? null : option
    );
    setShowPopUpSelectWeightLuggage(false);
  };

  // 🔥 SIMPLE: Validation function
  const validatePassengerInfo = () => {
    const errors = [];

    if (!passengerList || passengerList.length === 0) {
      return [
        {
          passengerIndex: -1,
          passengerName: "Tổng quát",
          errors: ["Không có thông tin hành khách"],
        },
      ];
    }

    passengerList.forEach((passenger, index) => {
      const passengerErrors = [];

      if (!passenger.ho_hanh_khach?.trim()) {
        passengerErrors.push("Họ hành khách");
      }

      if (!passenger.ten_hanh_khach?.trim()) {
        passengerErrors.push("Tên hành khách");
      }

      if (!passenger.danh_xung?.trim()) {
        passengerErrors.push("Danh xưng");
      }

      if (!passenger.dd || !passenger.mm || !passenger.yyyy) {
        passengerErrors.push("Ngày sinh");
      }

      if (!passenger.quoc_tich?.trim()) {
        passengerErrors.push("Quốc tịch");
      }

      if (passengerErrors.length > 0) {
        errors.push({
          passengerIndex: index,
          passengerName: `Hành khách ${index + 1}`,
          errors: passengerErrors,
        });
      }
    });

    return errors;
  };

  // 🔥 SIMPLE: Handle continue button
  const handleContinueToPayment = () => {
    const errors = validatePassengerInfo();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationAlert(true);

      setTimeout(() => {
        setShowValidationAlert(false);
      }, 5000);

      return;
    }

    setValidationErrors([]);
    setShowValidationAlert(false);
    setShowPopUpCheckInformation(true);
  };

  // 🔥 SIMPLE: Validation Alert
  const ValidationAlert = () => {
    if (!showValidationAlert || validationErrors.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              ⚠️ Vui lòng điền đầy đủ thông tin
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <strong>{error.passengerName}:</strong>{" "}
                    {error.errors.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowValidationAlert(false)}
              className="text-sm text-red-600 hover:text-red-800 font-medium mt-2"
            >
              Đã hiểu
            </button>
          </div>
          <button
            onClick={() => setShowValidationAlert(false)}
            className="ml-2 text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <ValidationAlert />

      <div className="flex justify-center gap-8 px-4 py-6">
        <div className="flex flex-col gap-4 max-w-3xl w-full">
          <Information_Customer
            passengers={passengerList}
            onChangePassenger={updatePassenger}
          />
        </div>

        <div className="self-start h-fit w-full max-w-sm sticky top-[90px]">
          <Trip_Summary
            flight={flight}
            selectedPackage={selectedPackage}
            passengers={passengerList}
          />
        </div>
      </div>

      <div className="w-full flex justify-center pb-5">
        <button
          onClick={handleContinueToPayment}
          className={`bg-[#007bff] text-white font-semibold px-6 py-3 rounded-[20px] 
            transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#025cbd]
            ${showValidationAlert ? "bg-red-500 hover:bg-red-600" : ""}`}
        >
          {showValidationAlert
            ? "⚠️ Vui lòng kiểm tra thông tin"
            : "Tiếp tục đến phần thanh toán"}
        </button>
      </div>

      {showPopUpCheckInformation && (
        <Check_Information_Booking
          passengers={passengerList}
          flight={flight}
          selectedPackage={selectedPackage}
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
