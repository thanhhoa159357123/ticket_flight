import React from "react";

const RoundTripSelector = ({ 
  selectedOutbound, 
  selectedReturn, 
  passengers, 
  onContinue 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalPassengers = () => {
    return (passengers?.Adult || 0) + (passengers?.Children || 0) + (passengers?.Infant || 0);
  };

  const totalPassengers = getTotalPassengers();
  const totalPrice = (selectedOutbound?.gia || 0) + (selectedReturn?.gia || 0);

  return (
    <div className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6">
        <div className="p-2 lg:p-3 bg-blue-100 rounded-full">
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">Chuyến bay khứ hồi</h3>
          <p className="text-sm text-gray-500">Chọn vé cho cả 2 chiều</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Step 1 - Outbound */}
          <div className={`flex items-center gap-2 lg:gap-3 ${selectedOutbound ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base ${
              selectedOutbound ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {selectedOutbound ? '✓' : '1'}
            </div>
            <span className="font-medium text-sm lg:text-base">Chuyến đi</span>
          </div>
          
          <div className="w-8 lg:w-12 h-0.5 bg-gray-300"></div>
          
          {/* Step 2 - Return */}
          <div className={`flex items-center gap-2 lg:gap-3 ${selectedReturn ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base ${
              selectedReturn ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {selectedReturn ? '✓' : '2'}
            </div>
            <span className="font-medium text-sm lg:text-base">Chuyến về</span>
          </div>
        </div>

        {/* Continue Button */}
        {selectedOutbound && selectedReturn && (
          <button
            onClick={onContinue}
            className="px-4 lg:px-6 py-2 lg:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg text-sm lg:text-base"
          >
            Tiếp tục →
          </button>
        )}
      </div>

      {/* Selected Flights Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Outbound Summary */}
        <div className={`border-2 rounded-xl p-4 transition-colors ${
          selectedOutbound ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 text-sm lg:text-base">Chuyến đi</h4>
          </div>
          
          {selectedOutbound ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {selectedOutbound.logo_hang_bay && (
                  <img 
                    src={selectedOutbound.logo_hang_bay} 
                    alt={selectedOutbound.ten_hang_bay}
                    className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                  />
                )}
                <span className="font-medium text-gray-800 text-sm lg:text-base">{selectedOutbound.ten_hang_bay}</span>
              </div>
              <p className="text-sm text-gray-600">
                {selectedOutbound.ma_san_bay_di} → {selectedOutbound.ma_san_bay_den}
              </p>
              <p className="text-xs lg:text-sm text-gray-500">
                {new Date(selectedOutbound.gio_di).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})} - {new Date(selectedOutbound.gio_den).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
              </p>
              <p className="text-base lg:text-lg font-bold text-green-600">
                {formatPrice(selectedOutbound.gia)}
              </p>
            </div>
          ) : (
            <div className="text-center py-4 lg:py-6">
              <p className="text-gray-500 text-xs lg:text-sm">Chọn chuyến bay đi từ danh sách bên dưới</p>
            </div>
          )}
        </div>

        {/* Return Summary */}
        <div className={`border-2 rounded-xl p-4 transition-colors ${
          selectedReturn ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-800 text-sm lg:text-base">Chuyến về</h4>
          </div>
          
          {selectedReturn ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {selectedReturn.logo_hang_bay && (
                  <img 
                    src={selectedReturn.logo_hang_bay} 
                    alt={selectedReturn.ten_hang_bay}
                    className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
                  />
                )}
                <span className="font-medium text-gray-800 text-sm lg:text-base">{selectedReturn.ten_hang_bay}</span>
              </div>
              <p className="text-sm text-gray-600">
                {selectedReturn.ma_san_bay_di} → {selectedReturn.ma_san_bay_den}
              </p>
              <p className="text-xs lg:text-sm text-gray-500">
                {new Date(selectedReturn.gio_di).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})} - {new Date(selectedReturn.gio_den).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
              </p>
              <p className="text-base lg:text-lg font-bold text-green-600">
                {formatPrice(selectedReturn.gia)}
              </p>
            </div>
          ) : (
            <div className="text-center py-4 lg:py-6">
              <p className="text-gray-500 text-xs lg:text-sm">
                {selectedOutbound ? 'Chọn chuyến bay về từ danh sách bên dưới' : 'Chưa chọn chuyến về'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Total Price */}
      {selectedOutbound && selectedReturn && (
        <div className="mt-4 lg:mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vé đi ({totalPassengers} khách):</span>
              <span className="font-medium">{formatPrice(selectedOutbound.gia * totalPassengers)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Vé về ({totalPassengers} khách):</span>
              <span className="font-medium">{formatPrice(selectedReturn.gia * totalPassengers)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-200">
              <span className="font-bold text-gray-900 text-sm lg:text-base">Tổng cộng:</span>
              <span className="text-xl lg:text-2xl font-bold text-red-600">
                {formatPrice(totalPrice * totalPassengers)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 lg:w-5 lg:h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Lưu ý quan trọng</p>
            <p className="text-xs lg:text-sm text-amber-700 mt-1">
              Bạn đang đặt 2 vé một chiều riêng biệt. Hãy chọn chuyến đi trước, sau đó chọn chuyến về.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundTripSelector;