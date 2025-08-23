import React from 'react';

const PackageCard = ({ pkg, isSelected, onSelect, type = "outbound", index, onShowDetail, formatPrice }) => {
  const isBlue = type === "outbound";
  
  return (
    <div
      className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? `border-${isBlue ? 'blue' : 'orange'}-500 bg-${isBlue ? 'blue' : 'orange'}-50 shadow-sm`
          : `border-gray-200 hover:border-${isBlue ? 'blue' : 'orange'}-300`
      }`}
      onClick={() => onSelect(pkg)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className={`text-xs font-medium text-${isBlue ? 'blue' : 'orange'}-600`}>
            {pkg.ten_hang_ve}
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold text-green-600">
            {formatPrice(pkg.gia_ve)}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-2">
        <div>Ký gửi: {pkg.so_kg_hanh_ly_ky_gui || 0}kg • Xách tay: {pkg.so_kg_hanh_ly_xach_tay || 0}kg</div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex gap-1">
          {pkg.refundable && (
            <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
              Hoàn vé
            </span>
          )}
          {pkg.changeable && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
              Đổi lịch bay
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShowDetail(pkg);
          }}
          className={`text-${isBlue ? 'blue' : 'orange'}-600 hover:text-${isBlue ? 'blue' : 'orange'}-800 font-medium`}
        >
          Chi tiết
        </button>
      </div>

      {isSelected && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className={`flex items-center gap-1 text-${isBlue ? 'blue' : 'orange'}-600 font-medium text-xs`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Đã chọn</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageCard;