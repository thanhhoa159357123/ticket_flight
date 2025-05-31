import React from "react";
import styles from "./ticket.module.scss";
import Navbar from "../../components/navbar/Navbar";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";

const Ticket = () => {
  return (
    <>
      <Navbar />
      <div className={styles.pageTicket}>
        <SideBar_Filter />
        <div className={styles.divider}></div>
        <Ticket_Content />
      </div>
    </>
  );
};

export default Ticket;
