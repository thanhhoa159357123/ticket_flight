import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";
import RoundTripSelector from "../../components/roundtrip/RoundTripSelector";
import RoundTripConfirmPanel from "../../components/roundtrip/RoundTripConfirmPanel/RoundTripConfirmPanel";
import TicketOptionsPanel from "../../components/ticketbook/TicketOptionsPanel/TicketOptionalsPanel";

const Ticket = () => {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState(() => {
    const stored = localStorage.getItem("ticketSearchData");
    return stored ? JSON.parse(stored) : null;
  });

  const [filters, setFilters] = useState({
    selectedAirlines: [],
    selectedTicketTypes: [],
    priceRange: [0, 0],
  });
  const [filtersReady, setFiltersReady] = useState(false);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showRoundTripConfirm, setShowRoundTripConfirm] = useState(false);
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    if (!ticketData) navigate("/", { replace: true });
  }, [ticketData, navigate]);

  if (!ticketData) return null;

  const {
    outboundFlights = [],
    returnFlights = [],
    searchInfo = {},
    searchType = "oneway",
  } = ticketData;

  const { passengers } = searchInfo;

  // ✅ Memo hóa applyFilters để tránh tính lại mỗi render
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const applyFilters = useCallback(
    (flights) => {
      const { selectedAirlines, selectedTicketTypes, priceRange } = filters;
      return (flights || []).filter((flight) => {
        if (!flight) return false;
        if (
          selectedAirlines.length > 0 &&
          !selectedAirlines.includes(flight.ten_hang_bay)
        )
          return false;
        if (
          selectedTicketTypes.length > 0 &&
          !selectedTicketTypes.includes(flight.ten_hang_ve)
        )
          return false;
        const price = flight.gia_ve || flight.gia || 0;
        if (
          priceRange[1] > 0 &&
          (price < priceRange[0] || price > priceRange[1])
        )
          return false;
        return true;
      });
    },
    [filters]
  );

  // ✅ Memo hóa danh sách đã lọc
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredOutboundFlights = useMemo(
    () => (filtersReady ? applyFilters(outboundFlights) : outboundFlights),
    [filtersReady, outboundFlights, applyFilters]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredReturnFlights = useMemo(
    () => (filtersReady ? applyFilters(returnFlights) : returnFlights),
    [filtersReady, returnFlights, applyFilters]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setFiltersReady(true);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleFlightSelect = useCallback((flight) => {
    if (!flight) return alert("Lỗi: Không có dữ liệu chuyến bay");
    setSelectedFlight(flight);
    setShowOptionsPanel(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* Sidebar lọc */}
          <div className="w-80 flex-shrink-0">
            <SideBar_Filter
              flights={!selectedOutbound ? outboundFlights : returnFlights}
              onChange={handleFiltersChange}
            />
          </div>

          {/* Nội dung chính */}
          <div className="flex-1">
            {searchType === "roundtrip" ? (
              <>
                <RoundTripSelector
                  selectedOutbound={selectedOutbound}
                  selectedReturn={selectedReturn}
                  passengers={passengers}
                  onContinue={() => {
                    if (selectedOutbound && selectedReturn)
                      setShowRoundTripConfirm(true);
                  }}
                />

                <Ticket_Content
                  flights={
                    !selectedOutbound
                      ? filteredOutboundFlights
                      : filteredReturnFlights
                  }
                  passengers={passengers}
                  searchInfo={searchInfo}
                  onFlightSelect={
                    !selectedOutbound
                      ? setSelectedOutbound
                      : setSelectedReturn
                  }
                  title={!selectedOutbound ? "Chuyến bay đi" : "Chuyến bay về"}
                />

                <RoundTripConfirmPanel
                  show={showRoundTripConfirm}
                  onClose={() => setShowRoundTripConfirm(false)}
                  selectedOutbound={selectedOutbound}
                  selectedReturn={selectedReturn}
                  passengers={passengers}
                />
              </>
            ) : (
              <>
                <Ticket_Content
                  flights={filteredOutboundFlights}
                  passengers={passengers}
                  searchInfo={searchInfo}
                  onFlightSelect={handleFlightSelect}
                  title="Chuyến bay đi"
                />
                {showOptionsPanel && selectedFlight && (
                  <TicketOptionsPanel
                    show={showOptionsPanel}
                    flight={selectedFlight}
                    passengers={passengers}
                    searchParams={searchInfo}
                    onClose={() => {
                      setShowOptionsPanel(false);
                      setSelectedFlight(null);
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Ticket);
