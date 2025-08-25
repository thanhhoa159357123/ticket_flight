import React from "react";

const ValidationAlert = ({ show, errors, onClose }) => {
  if (!show || errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">⚠️ Vui lòng điền đầy đủ thông tin</h3>
          <ul className="list-disc pl-5 mt-2 text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                <strong>{error.passengerName}:</strong> {error.errors.join(", ")}
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="text-sm text-red-600 hover:text-red-800 font-medium mt-2">
            Đã hiểu
          </button>
        </div>
        <button onClick={onClose} className="ml-2 text-red-400 hover:text-red-600">✕</button>
      </div>
    </div>
  );
};

export default ValidationAlert;
