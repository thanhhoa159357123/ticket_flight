import React from 'react';

const PassengerSummary = ({ passengers, getTotalPassengers }) => {
  const passengerData = [
    { label: "Tổng", value: getTotalPassengers(), color: "blue" },
    { label: "Người lớn", value: passengers?.Adult || 0, color: "green" },
    { label: "Trẻ em", value: passengers?.Children || 0, color: "orange" },
    { label: "Em bé", value: passengers?.Infant || 0, color: "purple" }
  ];

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Hành khách
      </h4>
      <div className="grid grid-cols-4 gap-3 text-xs">
        {passengerData.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg p-3 text-center">
            <div className={`text-lg font-bold text-${color}-600`}>{value}</div>
            <div className="text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerSummary;