import React, { useEffect, useState } from "react";
import Booking from "../../../components/booking/Booking";
import CloseIcon from "@mui/icons-material/Close";

const BookingModal = ({ isOpen, onClose, onSearchDone }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 bg-black/10 flex justify-center items-end sm:items-center p-4 transition-opacity duration-300 ${
        animate ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-[1600px] max-h-[90vh] overflow-y-auto rounded-xl bg-white relative pointer-events-auto shadow-lg transform transition-all duration-300 ${
          animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-200 ease-in-out cursor-pointer z-10"
        >
          <CloseIcon />
        </button>
        <Booking onSearchDone={onSearchDone} />
      </div>
    </div>
  );
};

export default BookingModal;
