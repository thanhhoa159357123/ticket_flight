import React, { useState } from "react";
import styles from "./booking.module.scss";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";

const Booking = () => {
  const options = ["Economy", "Business", "First Class"];
  const ways = ["One way / Round trip", "Multi City"];
  const people = [
    { type: "Adult", icon: <PersonIcon /> },
    { type: "Children", icon: <ChildCareIcon /> },
    { type: "Infant", icon: <BabyChangingStationIcon /> }
  ];

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
    <div className={styles.booking}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.topWay}>
            {ways.map((option) => (
              <button
                key={option}
                className={`${styles.wayOption} ${
                  selectedWay === option ? styles.active : ""
                }`}
                onClick={() => setSelectedWay(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={styles.topClass}>
            {options.map((option) => (
              <button
                key={option}
                className={`${styles.option} ${
                  selected === option ? styles.active : ""
                }`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={styles.passengerInputs}>
            {people.map(({type, icon}) => (
              <div className={styles.passengerItem} key={type}>
                <span className={styles.passengerLabel}>
                  {icon} {type}
                </span>
                <div className={styles.inputWrapper}>
                  <button 
                    className={styles.quantityBtn} 
                    onClick={() => handlePassengerInput(type, passengers[type] - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={passengers[type]}
                    onChange={(e) => handlePassengerInput(type, e.target.value)}
                    className={styles.passengerInput}
                  />
                  <button 
                    className={styles.quantityBtn} 
                    onClick={() => handlePassengerInput(type, passengers[type] + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.searchTable}>
          {/* Row 1: Labels */}
          <div className={styles.label}>From</div>
          <div className={styles.label}>To</div>
          <div className={styles.label}>Departure</div>
          <label className={styles.returnLabel}>
            <input type="checkbox" checked className={styles.checkbox} />
            <span>Return Date</span>
          </label>

          {/* Row 2: Inputs */}
          <div className={styles.field}>
            <FlightTakeoffIcon className={styles.icon} />
            <span>Ho Chi Minh (SGN)</span>
          </div>
          <div className={styles.field}>
            <div className={styles.swapButton}>
              <AutorenewIcon className={styles.swapIcon} />
            </div>
            <FlightLandIcon className={styles.icon} />
            <span>Hanoi (HAN)</span>
          </div>
          <div className={styles.field}>
            <CalendarMonthIcon className={styles.icon} />
            <span>11 May 2025</span>
          </div>
          <div className={styles.field}>
            <CalendarMonthIcon className={styles.icon} />
            <span>19 May 2025</span>
          </div>

          {/* Row 3: Button */}
          <div className={styles.searchButton}>
            <button className={styles.searchBtn}>
              <SearchIcon className={styles.searchIcon} />
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;