import React, { useState } from "react";
import HeaderContent from "./HeaderContent";
import FilterContent from "./FilterContent";
import ItemContent from "./item_content/ItemContent";
import TicketOptionsPanel from "../../../components/ticketbook/TicketOptionalsPanel";

const Ticket_Content = () => {
  const itemList = Array.from({ length: 5 });
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  return (
    <div className="flex flex-col gap-[20px]">
      <HeaderContent />
      <FilterContent />
      {itemList.map((_, index) => (
        <ItemContent key={index} onOpenOptions={() => setShowOptions(true)} />
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
