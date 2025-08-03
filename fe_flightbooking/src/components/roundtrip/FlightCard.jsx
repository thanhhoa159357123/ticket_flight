import React from 'react';

const FlightCard = ({ flight, formatTime }) => {
  return (
    <div className="bg-white rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {flight?.logo_hang_bay && (
            <img
              src={flight.logo_hang_bay}
              alt={flight.ten_hang_bay}
              className="w-6 h-6 object-contain"
            />
          )}
          <div>
            <div className="font-medium text-sm">{flight?.ten_hang_bay}</div>
            <div className="text-xs text-gray-500">{flight?.ma_chuyen_bay}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-lg font-bold">{formatTime(flight?.gio_di)}</div>
          <div className="text-xs text-gray-600">{flight?.ma_san_bay_di}</div>
        </div>
        <div className="flex-1 text-center mx-3">
          <div className="text-xs text-gray-500">2h 10m</div>
          <div className="border-t border-gray-300 my-1"></div>
          <div className="text-xs text-gray-400">Bay thẳng</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">{formatTime(flight?.gio_den)}</div>
          <div className="text-xs text-gray-600">{flight?.ma_san_bay_den}</div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;