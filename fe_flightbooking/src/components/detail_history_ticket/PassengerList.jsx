import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";

const PassengerList = ({ passengers }) => {
  if (!passengers || passengers.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="flex items-center text-lg font-semibold mb-3">
        <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
        Hành khách ({passengers.length})
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {passengers.map((hk, index) => (
          <div
            key={hk.ma_hanh_khach || index}
            className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="font-medium text-sm">
              {index + 1}. {hk.danh_xung || ""} {hk.ho_hanh_khach} {hk.ten_hanh_khach}
            </p>
            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
              {hk.ngay_sinh && (
                <p>Ngày sinh: {new Date(hk.ngay_sinh).toLocaleDateString("vi-VN")}</p>
              )}
              {hk.quoc_tich && (
                <p>Quốc tịch: {hk.quoc_tich}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerList;