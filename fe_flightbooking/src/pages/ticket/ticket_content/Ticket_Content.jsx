import React, { useState } from "react";
import HeaderContent from "./HeaderContent";
import ItemContent from "./item_content/ItemContent";
import TicketOptionsPanel from "../../../components/ticketbook/TicketOptionalsPanel";
import BookingModal from "./BookingModal";
import FilterContent from "./FilterContent";

const Ticket_Content = ({ flights }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [, setShowTicketDetail] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleSearchDone = () => {
    setShowBookingModal(false);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <HeaderContent />
      <FilterContent onSearchAgain={() => setShowBookingModal(true)} />
      {Array.isArray(flights) &&
        flights.map((flight, index) => (
          <ItemContent
            key={index}
            flight={flight}
            onOpenOptions={() => setShowOptions(true)}
          />
        ))}

      {showOptions && (
        <TicketOptionsPanel
          onClose={() => setShowOptions(false)}
          onShowDetail={() => setShowTicketDetail(true)}
        />
      )}

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSearchDone={handleSearchDone}
      />
    </div>
  );
};

export default Ticket_Content;
