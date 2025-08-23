import React from "react";
import TicketMoreDetail from "../../ticketbook/TicketMoreDetail";

const PackageDetailModal = ({ show, onClose, ticketPkg, passengers }) => {
  if (!show || !ticketPkg) return null;
  return (
    <TicketMoreDetail
      show={show}
      onClose={onClose}
      ticketPkg={ticketPkg}
      passengers={passengers}
    />
  );
};

export default PackageDetailModal;
