import React from "react";
import { MapPinIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const FlightInfoCard = ({ 
  departure, 
  arrival, 
  departureTime, 
  arrivalTime, 
  title, 
  bgColor = "bg-blue-50" 
}) => (
  <div className={`${bgColor} rounded-lg p-4 mb-3 transition-all duration-200 hover:shadow-md`}>
    <h4 className="font-semibold text-gray-800 mb-3 text-sm">{title}</h4>
    <div className="flex items-center justify-between">
      <div className="text-center flex-1">
        <div className="flex items-center justify-center text-gray-900 mb-1">
          <MapPinIcon className="h-3 w-3 mr-1" />
          <span className="font-medium text-sm">{departure}</span>
        </div>
        {departureTime && (
          <div className="text-xs text-gray-600">
            {new Date(departureTime).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        )}
      </div>

      <ArrowRightIcon className="h-4 w-4 text-gray-400 mx-3" />

      <div className="text-center flex-1">
        <div className="flex items-center justify-center text-gray-900 mb-1">
          <MapPinIcon className="h-3 w-3 mr-1" />
          <span className="font-medium text-sm">{arrival}</span>
        </div>
        {arrivalTime && (
          <div className="text-xs text-gray-600">
            {new Date(arrivalTime).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric", 
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default FlightInfoCard;