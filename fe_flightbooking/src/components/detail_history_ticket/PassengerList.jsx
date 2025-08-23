import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const PassengerList = ({ passengers }) => {
  if (!passengers || passengers.length === 0) return null;
  // Helper function to format date as DD/MM/YYYY
  function formatVietnameseDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-3">
        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
        Hành khách ({passengers.length})
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {passengers.map((p, index) => (
          <div key={index} className="mb-2">
            <div className="font-semibold">
              {index + 1}. {p?.ho_hanh_khach || ""} {p?.ten_hanh_khach || ""}
            </div>
            {p?.ngay_sinh && (
              <div className="text-sm text-gray-600">
                Ngày sinh: {formatVietnameseDate(p.ngay_sinh)}
              </div>
            )}
            {/* Add more if needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerList;
