import React from "react";

const HeaderRow = ({ isMultiCity, isOneWay }) => (
  <>
    <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
      From
    </div>
    <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
      To
    </div>
    {isMultiCity ? (
      <>
        <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
          Departure
        </div>
        <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
          Action
        </div>
      </>
    ) : (
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-0">
        <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
          Departure
        </div>
        <div className="text-[1rem] md:text-[1.2rem] font-semibold text-[#017EBE] uppercase tracking-wide mb-1 md:mb-2">
          {!isOneWay && "Return Date"}
        </div>
      </div>
    )}
  </>
);

export default React.memo(HeaderRow);
