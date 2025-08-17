import React, { useState, useMemo } from "react";
import ItemContent from "./item_content/ItemContent";

const Ticket_Content = ({
  flights = [],
  passengers,
  searchInfo,
  onFlightSelect
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ✅ Filter valid flights
  const validFlights = useMemo(() => {
    return flights.filter(flight => flight && (flight.ma_ve || flight.ma_gia_ve));
  }, [flights]);

  // ✅ Pagination
  const totalPages = Math.ceil(validFlights.length / ITEMS_PER_PAGE);
  const paginatedFlights = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return validFlights.slice(startIndex, endIndex);
  }, [validFlights, currentPage]);

  return (
    <div className="space-y-6">
      {/* ✅ Header với thông tin tìm kiếm */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {searchInfo?.from || "N/A"} → {searchInfo?.to || "N/A"}
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tìm thấy</p>
            <p className="text-lg font-semibold text-blue-600">
              {validFlights.length} chuyến bay
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {searchInfo?.departureDate && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                Ngày đi: {new Date(searchInfo.departureDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
          )}
          
          {searchInfo?.selected && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Hạng vé: {searchInfo.selected}</span>
            </div>
          )}
          
          {passengers && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>
                {passengers.Adult} người lớn
                {passengers.Child > 0 && `, ${passengers.Child} trẻ em`}
                {passengers.Infant > 0 && `, ${passengers.Infant} em bé`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Conditional content: Show flights OR empty state */}
      {validFlights.length > 0 ? (
        <>
          {/* ✅ Flight list */}
          <div className="space-y-4">
            {paginatedFlights.map((flight, index) => {
              const flightKey = flight.ma_ve || flight.ma_gia_ve || `flight-${index}`;
              return (
                <ItemContent
                  key={flightKey}
                  flight={flight}
                  onFlightSelect={onFlightSelect}
                  passengers={passengers}
                />
              );
            })}
          </div>

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, validFlights.length)} 
                  trong tổng số {validFlights.length} chuyến bay
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>
                  
                  <span className="px-3 py-2 text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ✅ No flights found */
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Vé bạn cần tìm không có
          </h3>
          <p className="text-gray-500">
            Không tìm thấy chuyến bay phù hợp với yêu cầu của bạn
          </p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            ← Quay lại tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Ticket_Content);