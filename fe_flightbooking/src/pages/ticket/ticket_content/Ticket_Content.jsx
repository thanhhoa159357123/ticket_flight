import React, { useState, useMemo } from "react";
import ItemContent from "./item_content/ItemContent";

const Ticket_Content = ({ flights, passengers, onFlightSelect, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const validFlights = useMemo(() => {
    return (flights || []).filter((f) => f?.ma_ve || f?.ma_gia_ve);
  }, [flights]);

  const totalPages = Math.ceil(validFlights.length / ITEMS_PER_PAGE);

  const paginatedFlights = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return validFlights.slice(start, start + ITEMS_PER_PAGE);
  }, [validFlights, currentPage]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || "Danh sách chuyến bay"}
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-500">Tìm thấy</p>
            <p className="text-lg font-semibold text-blue-600">
              {validFlights.length} chuyến bay
            </p>
          </div>
        </div>
      </div>

      {validFlights.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedFlights.map((flight, index) => (
              <ItemContent
                key={flight.ma_ve || flight.ma_gia_ve || `flight-${index}`}
                flight={flight}
                onFlightSelect={onFlightSelect}
                passengers={passengers}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="btn"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy chuyến bay
          </h3>
          <p className="text-gray-500">
            Không có chuyến bay phù hợp với bộ lọc của bạn.
          </p>
        </div>
      )}
    </div>
  );
};

// ✅ Tối ưu so sánh props
function areEqual(prev, next) {
  return (
    prev.flights === next.flights &&
    prev.passengers === next.passengers &&
    prev.onFlightSelect === next.onFlightSelect &&
    prev.title === next.title
  );
}

export default React.memo(Ticket_Content, areEqual);
