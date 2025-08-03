import React from 'react';
import FlightCard from './FlightCard';
import PackageCard from './PackageCard';

const FlightSection = ({ 
  title, 
  flight, 
  packages, 
  selectedPackage, 
  onPackageSelect, 
  type,
  formatTime,
  formatPrice,
  formatDate,
  onShowDetail
}) => {
  const isBlue = type === "outbound";
  const colorClass = isBlue ? "blue" : "orange";
  
  const IconPath = isBlue 
    ? "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
    : "M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6";

  return (
    <div className={`bg-gradient-to-br from-${colorClass}-50 to-${colorClass}-100 rounded-xl p-4 border border-${colorClass}-200`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 bg-${colorClass}-500 rounded-lg`}>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={IconPath} />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-600">
            {flight?.ten_thanh_pho_di} → {flight?.ten_thanh_pho_den} • {formatDate(flight?.gio_di)}
          </p>
        </div>
      </div>

      <FlightCard flight={flight} formatTime={formatTime} />

      <div>
        <h4 className="font-medium text-gray-800 mb-3 text-sm">Chọn gói vé:</h4>
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {packages.slice(0, 3).map((pkg, index) => (
              <PackageCard
                key={pkg.ma_gia_ve || index}
                pkg={pkg}
                isSelected={selectedPackage?.ma_gia_ve === pkg.ma_gia_ve}
                onSelect={onPackageSelect}
                type={type}
                index={index}
                onShowDetail={onShowDetail}
                formatPrice={formatPrice}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-white rounded-lg text-sm">
            Không có gói vé nào
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSection;