import React, { useState, useRef, useEffect } from "react";
import WorkIcon from "@mui/icons-material/Work";
import CheckIcon from "@mui/icons-material/Check";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import LuggageIcon from "@mui/icons-material/Luggage";

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
  const [, setHeight] = useState(0);
  const contentRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(showAllOptions ? contentRef.current.scrollHeight : 0);
    }
  }, [showAllOptions]);

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

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-10" onClick={onClose}></div>

      <div
        className={`
    fixed z-20 left-1/2 top-1/2 transform -translate-x-1/2 
    ${animateIn ? "-translate-y-1/2 opacity-100" : "translate-y-full opacity-0"}
    transition-all duration-300 ease-in-out
    bg-white rounded-xl shadow-2xl w-full max-w-[900px] h-[700px] flex flex-col overflow-hidden
  `}
      >
        <div className="flex flex-1 h-[calc(100%-72px)]">
          {/* Left */}
          <div className="w-[30%] border-r px-5 py-6 bg-gray-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <WorkIcon />
                <h2 className="font-bold text-lg">Hành lý</h2>
              </div>
              <button className="text-sm font-medium text-blue-500 hover:underline">
                Xem chi tiết
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <div className="flex items-center gap-2">
                <CheckIcon
                  className="text-xs bg-green-500 text-white rounded-full"
                  fontSize="inherit"
                />
                <span>Được hoàn vé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon
                  className="text-xs bg-green-500 text-white rounded-full"
                  fontSize="inherit"
                />
                <span>Đổi lịch khả dụng</span>
              </div>
            </div>

            <div className="text-[15px] text-gray-800 space-y-1">
              <p className="font-semibold">Chọn chuyến bay</p>
              <p>Thêm hành lý kí gửi vào chuyến bay của bạn</p>
            </div>

            <div className="border-l-4 pl-4 pr-3 mt-5 border-blue-500 bg-blue-50 py-3 rounded-md text-sm">
              <div className="flex items-center gap-1 font-semibold text-gray-800">
                <span>TPHCM (SGN)</span>
                <TrendingFlatIcon className="text-gray-600" />
                <span>Hà Nội (HAN)</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm mt-1">
                <span>{getLuggageLabel()}</span>
                <span>{getLuggagePrice()}</span>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[70%] flex flex-col h-full">
            {/* Scrollable content */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-800 font-semibold text-base">
                    <span>TPHCM (SGN)</span>
                    <TrendingFlatIcon className="text-gray-600" />
                    <span>Hà Nội (HAN)</span>
                  </div>
                  <p className="text-sm text-gray-600">VietJet Air</p>
                </div>

                <div className="bg-white border-2 border-t-4 border-t-blue-500 border-gray-200 rounded-lg p-5 shadow-sm space-y-5">
                  <div className="border-b pb-2">
                    <p className="font-medium text-gray-800">Hành khách 1/1</p>
                    <p className="text-sm text-gray-600">Người lớn 1</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <LuggageIcon className="text-blue-500" />
                        <div className="flex flex-col leading-tight">
                          <span className="text-gray-500">
                            Đã bao gồm (Miễn phí)
                          </span>
                          <span className="font-semibold text-gray-800">
                            0 kg
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start text-sm">
                        <span className="text-gray-500">Tổng số hành lý</span>
                        <span className="font-semibold text-gray-800">
                          {getLuggageLabel()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {/* Visible options (always shown) */}
                      {luggageOptions.slice(0, 4).map((option, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedIndex(index)}
                          className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                            selectedIndex === index
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                selectedIndex === index
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedIndex === index && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <LuggageIcon
                              className={`${
                                selectedIndex === index
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <span className="text-sm">{option.label}</span>
                          </div>
                          {option.price !== null && (
                            <span
                              className={`text-sm font-semibold ${
                                selectedIndex === index
                                  ? "text-orange-600"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.price.toLocaleString("vi-VN")} VND
                            </span>
                          )}
                        </div>
                      ))}

                      {/* Additional options with animation */}
                      <div
                        ref={contentRef}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          showAllOptions ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          {luggageOptions.slice(4).map((option, index) => (
                            <div
                              key={index + 4}
                              onClick={() => setSelectedIndex(index + 4)}
                              className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${
                                selectedIndex === index + 4
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-300 hover:border-blue-300"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                                    selectedIndex === index + 4
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedIndex === index + 4 && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <LuggageIcon
                                  className={`${
                                    selectedIndex === index + 4
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                  }`}
                                />
                                <span className="text-sm">{option.label}</span>
                              </div>
                              {option.price !== null && (
                                <span
                                  className={`text-sm font-semibold ${
                                    selectedIndex === index + 4
                                      ? "text-orange-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {option.price.toLocaleString("vi-VN")} VND
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {luggageOptions.length > 4 && (
                        <button
                          onClick={toggleOptions}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 text-left transition-colors duration-300 ease-in-out flex items-center"
                        >
                          {showAllOptions ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 transition-transform duration-300 rotate-180"
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
                              Ẩn bớt
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1 transition-transform duration-300"
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
                              Hiện thêm
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

        {/* Footer - Fixed at bottom */}
        <div className="w-full border-t px-6 py-4 flex justify-between items-center bg-white h-[72px]">
          <span className="font-semibold text-orange-600 text-lg">
            {getLuggagePrice()}
          </span>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out shadow-md transform cursor-pointer hover:scale-105"
            onClick={() => {
              const selectedOption = luggageOptions[selectedIndex];
              // Gửi dữ liệu về Booking
              onSelect?.(selectedOption);

              // Gọi animation ẩn rồi đóng
              setAnimateIn(false);
              setTimeout(() => onClose(), 300);
            }}
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </>
  );
};

export default Select_Luggage_Weight;
