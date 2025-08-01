import React, { useState, useRef, useEffect } from "react";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LuggageIcon from "@mui/icons-material/Luggage";
import CloseIcon from "@mui/icons-material/Close";

const luggageOptions = [
  { label: "Không có hành lý bổ sung", price: null },
  { label: "+20 kg", price: 266000 },
  { label: "+30 kg", price: 374000 },
  { label: "+40 kg", price: 482000 },
  { label: "+50 kg", price: 644000 },
  { label: "+60 kg", price: 752000 },
  { label: "+70 kg", price: 860000 },
];

const Select_Luggage_Weight = ({ onClose, onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const toggleOptions = () => {
    setShowAllOptions(!showAllOptions);
  };

  const getLuggageLabel = () =>
    selectedIndex === 0
      ? "0 kg"
      : luggageOptions[selectedIndex]?.label || "0 kg";

  const getLuggagePrice = () =>
    selectedIndex === 0
      ? "0 VND"
      : `${
          luggageOptions[selectedIndex]?.price?.toLocaleString("vi-VN") || "0"
        } VND`;

  const handleSelect = () => {
    const selectedOption = luggageOptions[selectedIndex];
    onSelect?.(selectedOption);
    setAnimateIn(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-10 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div
        className={`fixed z-20 left-1/2 top-1/2 transform -translate-x-1/2 
        ${
          animateIn
            ? "-translate-y-1/2 opacity-100"
            : "translate-y-full opacity-0"
        }
        transition-all duration-300 ease-out
        bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[85vh] max-h-[700px] flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <WorkIcon className="text-blue-500" />
            Chọn hành lý ký gửi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-1 h-[calc(100%-80px)] overflow-hidden">
          {/* Left Panel */}
          <div className="w-[35%] border-r p-6 bg-gray-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <LuggageIcon className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg">Thông tin hành lý</h3>
              </div>
            </div>

            <div className="text-gray-800 space-y-2 mb-6">
              <h4 className="font-semibold text-base">Chọn chuyến bay</h4>
              <p className="text-gray-600">
                Thêm hành lý kí gửi vào chuyến bay của bạn
              </p>
            </div>

            <div className="border-l-4 pl-4 pr-3 border-blue-500 bg-blue-50 py-3 rounded-lg">
              <div className="flex items-center gap-2 font-medium text-gray-800">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  SGN
                </span>
                <TrendingFlatIcon className="text-gray-500" />
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                  HAN
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <LuggageIcon className="text-gray-500 text-sm" />
                  <span className="text-sm">{getLuggageLabel()}</span>
                </div>
                <span className="font-semibold text-orange-500">
                  {getLuggagePrice()}
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[65%] flex flex-col h-full">
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Flight Info */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3 text-gray-800 font-semibold">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      SGN
                    </span>
                    <TrendingFlatIcon className="text-gray-500" />
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      HAN
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">VietJet Air • VJ123</p>
                </div>

                {/* Passenger Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                  <div className="border-b border-gray-100 pb-3 mb-4">
                    <p className="font-semibold text-gray-800">Hành khách 1/1</p>
                    <p className="text-sm text-gray-500">Người lớn</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <LuggageIcon className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Đã bao gồm</p>
                          <p className="font-medium text-gray-800">0 kg</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Tổng số hành lý</p>
                        <p className="font-semibold text-gray-800">
                          {getLuggageLabel()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Luggage Options */}
                      {luggageOptions.slice(0, 4).map((option, index) => (
                        <LuggageOption
                          key={index}
                          option={option}
                          index={index}
                          selectedIndex={selectedIndex}
                          onClick={() => setSelectedIndex(index)}
                        />
                      ))}

                      {/* Collapsible Options */}
                      <div
                        ref={contentRef}
                        className={`overflow-hidden transition-all duration-300 ${
                          showAllOptions ? "max-h-[500px]" : "max-h-0"
                        }`}
                      >
                        <div className="space-y-3">
                          {luggageOptions.slice(4).map((option, index) => (
                            <LuggageOption
                              key={index + 4}
                              option={option}
                              index={index + 4}
                              selectedIndex={selectedIndex}
                              onClick={() => setSelectedIndex(index + 4)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Toggle Button */}
                      {luggageOptions.length > 4 && (
                        <button
                          onClick={toggleOptions}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center justify-center w-full py-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          {showAllOptions ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                              Thu gọn
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                              Xem thêm lựa chọn
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full border-t border-gray-100 px-6 py-4 flex justify-between items-center bg-white">
          <div>
            <p className="text-sm text-gray-500">Tổng cộng</p>
            <p className="font-bold text-orange-600 text-xl">
              {getLuggagePrice()}
            </p>
          </div>
          <button
            onClick={handleSelect}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-2"
          >
            Xác nhận chọn
          </button>
        </div>
      </div>
    </>
  );
};

// Sub-component for luggage option item
// eslint-disable-next-line react-refresh/only-export-components
const LuggageOption = ({ option, index, selectedIndex, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center p-4 border rounded-xl cursor-pointer transition-all ${
        selectedIndex === index
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            selectedIndex === index
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300"
          }`}
        >
          {selectedIndex === index && (
            <CheckIcon className="text-white text-sm" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <LuggageIcon
            className={`${
              selectedIndex === index ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <span className="text-sm font-medium">{option.label}</span>
        </div>
      </div>
      {option.price !== null && (
        <span
          className={`font-semibold ${
            selectedIndex === index ? "text-orange-600" : "text-gray-700"
          }`}
        >
          {option.price.toLocaleString("vi-VN")} VND
        </span>
      )}
    </div>
  );
};

export default Select_Luggage_Weight;