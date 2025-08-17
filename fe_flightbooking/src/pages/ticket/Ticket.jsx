import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";
import TicketOptionsPanel from "../../components/ticketbook/TicketOptionalsPanel";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ States
  const [loading, setLoading] = useState(false);
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  
  // ✅ TicketOptionsPanel states
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  // ✅ Extract data from navigation state
  const searchInfo = location.state?.searchInfo || {};
  const outboundFlights = location.state?.outboundFlights || location.state?.results || [];
  const { passengers } = searchInfo;

  // 🔥 Create searchParams object từ searchInfo
  const searchParams = {
    departureCity: searchInfo.departureCity,
    arrivalCity: searchInfo.arrivalCity,
    departureDate: searchInfo.departureDate,
    returnDate: searchInfo.returnDate,
    roundTrip: searchInfo.roundTrip || false,
    passengers: passengers || 1,
  };

  // ✅ Apply filters
  const filteredFlights = outboundFlights.filter((flight) => {
    // Airline filter
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.ten_hang_bay)) {
      return false;
    }
    
    // Ticket type filter  
    if (selectedTicketTypes.length > 0 && !selectedTicketTypes.includes(flight.ten_hang_ve)) {
      return false;
    }
    
    // Price filter
    const price = flight.gia_ve || flight.gia || 0;
    if (priceRange[1] > 0 && (price < priceRange[0] || price > priceRange[1])) {
      return false;
    }
    
    return true;
  });

  // ✅ Handle flight selection
  const handleFlightSelect = (flight) => {
    // ✅ Validate flight data
    if (!flight) {
      console.error("❌ No flight data provided");
      alert("Lỗi: Không có dữ liệu chuyến bay");
      return;
    }

    // ✅ Validate mã vé
    const flightId = flight.ma_ve || flight.ma_gia_ve || flight.id;
    if (!flightId) {
      console.error("❌ Flight missing ID:", flight);
      alert("Lỗi: Chuyến bay không có mã định danh");
      return;
    }

    // ✅ Set flight và show panel
    setSelectedFlight(flight);
    setShowOptionsPanel(true);
  };

  // 🔥 FIX: Handle package selection - Close panel và let TicketOptionsPanel navigate
  const handlePackageSelect = async (packageData) => {    
    // ✅ Validate data
    if (!selectedFlight || !packageData) {
      console.error("❌ Missing data for booking:", { selectedFlight, packageData });
      alert("Lỗi: Thiếu thông tin để đặt vé");
      return;
    }

    handleCloseOptionsPanel();
  };

  // ✅ Close options panel
  const handleCloseOptionsPanel = () => {
    setShowOptionsPanel(false);
    setSelectedFlight(null);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50"> 
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 max-w-7xl mx-auto">
          {/* ✅ Sidebar filters */}
          <div className="w-80 flex-shrink-0">
            <SideBar_Filter
              flights={filteredFlights}
              selectedAirlines={selectedAirlines}
              setSelectedAirlines={setSelectedAirlines}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* ✅ Main content */}
          <div className="flex-1">
            <Ticket_Content
              flights={filteredFlights}
              passengers={passengers}
              searchInfo={searchInfo}
              onFlightSelect={handleFlightSelect}
            />
          </div>
        </div>
      </div>

      {/* FIX: PROPER PROPS - Thêm searchParams và sửa onChoose */}
      {showOptionsPanel && selectedFlight && (
        <TicketOptionsPanel
          show={showOptionsPanel}
          flight={selectedFlight}
          passengers={passengers}
          searchParams={searchParams}
          onClose={handleCloseOptionsPanel}
          // onChoose={handlePackageSelect}
        />
      )}
    </div>
  );
};

export default Ticket;
