import React, { useState } from "react";
import HeaderContent from "./HeaderContent";
import ItemContent from "./item_content/ItemContent";
import TicketOptionsPanel from "../../../components/ticketbook/TicketOptionalsPanel";

const Ticket_Content = ({ flights }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [, setShowTicketDetail] = useState(false);

  return (
    <div className="flex flex-col gap-[20px]">
      <HeaderContent />
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
    </div>
  );
};

export default Ticket_Content;
