import React, { useState } from "react";
import "./booking.scss";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const Booking = () => {
  const options = ["Economy", "Business Class", "First Class"];
  const ways = ["One way / Round trip", "Multi City"];
  const people = ["Adult", "Children", "Infant"];

  const [selected, setSelected] = useState(options[0]);
  const [selectedWay, setSelectedWay] = useState(ways[0]);
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });

  const handlePassengerInput = (type, value) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, parseInt(value) || 0),
    }));
  };

  return (
    <div className="booking">
      <div className="container">
        <div className="top-section">
          <div className="top-way">
            {ways.map((option) => (
              <span
                key={option}
                className={`way-option ${
                  selectedWay === option ? "active" : ""
                }`}
                onClick={() => setSelectedWay(option)}
              >
                {option}
              </span>
            ))}
          </div>

          <div className="top-class">
            {options.map((option) => (
              <span
                key={option}
                className={`option ${selected === option ? "active" : ""}`}
                onClick={() => setSelected(option)}
              >
                {option}
              </span>
            ))}
          </div>

          <div className="passenger-inputs">
            {people.map((type) => (
              <div className="passenger-item" key={type}>
                <span className="option">{type} : </span>
                <input
                  type="number"
                  min="0"
                  value={passengers[type]}
                  onChange={(e) => handlePassengerInput(type, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
