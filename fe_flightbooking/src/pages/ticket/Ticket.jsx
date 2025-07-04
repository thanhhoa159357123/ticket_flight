import React from "react";
import Navbar from "../../components/Navbar";
import SideBar_Filter from "./sidebarfilter/SideBar_Filter";
import Ticket_Content from "./ticket_content/Ticket_Content";

const Ticket = () => {
  return (
    <>
      <Navbar />
      <div className="pt-[30px] flex items-start justify-center gap-[10px] w-full max-w-[1500px] mx-auto min-h-[calc(100vh-100px)]">
        <SideBar_Filter />
        <div className="w-[1px] h-full bg-black/10 rounded-md" />
        <div className="flex-1 max-w-[800px]">
          <Ticket_Content />
        </div>
      </div>
    </>
  );
};

export default Ticket;
