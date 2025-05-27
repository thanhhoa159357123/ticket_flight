import React from "react";
import HeaderContent from "./header_content/HeaderContent";
import FilterContent from "./filter_content/FilterContent";
import styles from "./ticket_content.module.scss";
import ItemContent from "./item_content/ItemContent";

const Ticket_Content = () => {
  const itemList = Array.from({ length: 5 });
  return (
    <div className={styles.ticketContent}>
      <HeaderContent />
      <FilterContent />
      {itemList.map((_, index) => (
        <ItemContent key={index} />
      ))}
    </div>
  );
};

export default Ticket_Content;
