import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./booking.module.scss";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddIcon from "@mui/icons-material/Add";

const SearchTable = ({
  selectedWay,
  returnDate,
  setReturnDate,
  multiCityRoutes,
  removeMultiCityRoute,
  addMultiCityRoute,
}) => {
  const [from, setFrom] = useState("Ho Chi Minh (SGN)");
  const [to, setTo] = useState("Hanoi (HAN)");

  const handleSwapLocation = () => {
    setFrom(to);
    setTo(from);
  };
  return (
    <div
      className={`${styles.searchTable} ${
        selectedWay === "Multi City" ? styles.multiCity : ""
      }`}
    >
      {/* Labels Row */}
      <div className={styles.label}>From</div>
      <div className={styles.label}>To</div>
      <div className={styles.label}>Departure</div>

      {selectedWay === "One way / Round trip" ? (
        <label className={styles.returnLabel}>
          <input
            type="checkbox"
            checked={returnDate}
            onChange={() => setReturnDate(!returnDate)}
            className={styles.checkbox}
          />
          <span>Return Date</span>
        </label>
      ) : (
        <div className={styles.label}>Action</div>
      )}

      {/* Content Rows */}
      {selectedWay === "One way / Round trip" ? (
        <>
          <div className={styles.field}>
            <FlightTakeoffIcon className={styles.icon} />
            <span>{from}</span>
          </div>
          <div className={styles.field}>
            <div className={styles.swapButton} onClick={handleSwapLocation}>
              <AutorenewIcon className={styles.swapIcon} />
            </div>
            <FlightLandIcon className={styles.icon} />
            <span>{to}</span>
          </div>
          <div className={styles.field}>
            <CalendarMonthIcon className={styles.icon} />
            <span>11 May 2025</span>
          </div>
          {returnDate ? (
            <div className={styles.field}>
              <CalendarMonthIcon className={styles.icon} />
              <span>19 May 2025</span>
            </div>
          ) : (
            <div className={styles.emptyField}>
              <CalendarMonthIcon className={styles.icon} />
              <span>19 May 2025</span>
            </div>
          )}
        </>
      ) : (
        <>
          {multiCityRoutes.map((route, index) => (
            <React.Fragment key={index}>
              <div className={styles.field}>
                <FlightTakeoffIcon className={styles.icon} />
                <span>{route.from || "Select city"}</span>
              </div>
              <div className={styles.field}>
                <div className={styles.swapButton}>
                  <AutorenewIcon className={styles.swapIcon} />
                </div>
                <FlightLandIcon className={styles.icon} />
                <span>{route.to || "Select city"}</span>
              </div>
              <div className={styles.field}>
                <CalendarMonthIcon className={styles.icon} />
                <span>{route.departure || "Select date"}</span>
              </div>
              <div>
                {multiCityRoutes.length > 1 && (
                  <button
                    className={styles.removeButton}
                    onClick={() => removeMultiCityRoute(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </React.Fragment>
          ))}
        </>
      )}

      {selectedWay === "Multi City" && (
        <div className={styles.addRouteButton}>
          <button onClick={addMultiCityRoute}>
            <AddIcon /> Add Destination
          </button>
        </div>
      )}

      {/* Search Button */}
      <Link to="/flight-ticket" className={styles.searchButton}>
        <button className={styles.searchBtn}>
          <SearchIcon className={styles.searchIcon} />
          Search Flights
        </button>
      </Link>
    </div>
  );
};

export default SearchTable;
