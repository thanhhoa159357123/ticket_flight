import { useState } from "react";

export const useBookingValidation = () => {
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const validatePassengerInfo = (passengerList) => {
    const errors = [];
    if (!passengerList || passengerList.length === 0) {
      return [{ passengerIndex: -1, passengerName: "Tổng quát", errors: ["Không có thông tin hành khách"] }];
    }

    passengerList.forEach((passenger, index) => {
      const passengerErrors = [];
      if (!passenger.ho_hanh_khach?.trim()) passengerErrors.push("Họ hành khách");
      if (!passenger.ten_hanh_khach?.trim()) passengerErrors.push("Tên hành khách");
      if (!passenger.danh_xung?.trim()) passengerErrors.push("Danh xưng");
      if (!passenger.dd || !passenger.mm || !passenger.yyyy) passengerErrors.push("Ngày sinh");
      if (!passenger.quoc_tich?.trim()) passengerErrors.push("Quốc tịch");

      if (passengerErrors.length > 0) {
        errors.push({
          passengerIndex: index,
          passengerName: `Hành khách ${index + 1}`,
          errors: passengerErrors
        });
      }
    });

    setValidationErrors(errors);
    setShowValidationAlert(errors.length > 0);
    return errors;
  };

  return {
    validationErrors,
    showValidationAlert,
    setShowValidationAlert,
    validatePassengerInfo,
  };
};
