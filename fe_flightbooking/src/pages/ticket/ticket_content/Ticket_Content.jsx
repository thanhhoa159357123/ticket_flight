import React, { useState } from "react";
import HeaderContent from "./header_content/HeaderContent";
import FilterContent from "./filter_content/FilterContent";
import styles from "./ticket_content.module.scss";
import ItemContent from "./item_content/ItemContent";
import TicketOptionsPanel from "../../../components/ticketbook/TicketOptionsPanel/TicketOptionalsPanel";

const Ticket_Content = () => {
  const itemList = Array.from({ length: 5 });
  const [showOptions, setShowOptions] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  return (
    <div className={styles.ticketContent}>
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
