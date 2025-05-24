import React, { useState } from "react";
import styles from "./booking.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import SearchTable from "./SearchTable";

const Booking = () => {
  const options = ["Economy", "Business", "First Class"];
  const ways = ["One way / Round trip", "Multi City"];
  const people = [
    { type: "Adult", icon: <PersonIcon /> },
    { type: "Children", icon: <ChildCareIcon /> },
    { type: "Infant", icon: <BabyChangingStationIcon /> },
  ];

  const [selected, setSelected] = useState(options[0]);
  const [selectedWay, setSelectedWay] = useState(ways[0]);
  const [passengers, setPassengers] = useState({
    Adult: 1,
    Children: 0,
    Infant: 0,
  });
  const [multiCityRoutes, setMultiCityRoutes] = useState([
    { from: "Ho Chi Minh (SGN)", to: "Hanoi (HAN)", departure: "11 May 2025" },
  ]);
  const [returnDate, setReturnDate] = useState(true);

  const handlePassengerInput = (type, value) => {
    // Nếu value là chuỗi rỗng (khi xóa hết nội dung)
    if (value === "") {
      // Nếu là Adult thì set về 1, các loại khác set về 0
      const defaultValue = type === "Adult" ? 1 : 0;
      setPassengers((prev) => ({
        ...prev,
        [type]: defaultValue,
      }));
    } else {
      // Xử lý giá trị số bình thường
      const numValue = parseInt(value) || 0;
      setPassengers((prev) => ({
        ...prev,
        [type]: Math.max(0, numValue),
      }));
    }
  };

  const addMultiCityRoute = () => {
    setMultiCityRoutes([
      ...multiCityRoutes,
      { from: "", to: "", departure: "" },
    ]);
  };

  const removeMultiCityRoute = (index) => {
    if (multiCityRoutes.length > 1) {
      const updatedRoutes = [...multiCityRoutes];
      updatedRoutes.splice(index, 1);
      setMultiCityRoutes(updatedRoutes);
    }
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
            {people.map(({ type, icon }) => (
              <div className={styles.passengerItem} key={type}>
                <span className={styles.passengerLabel}>
                  {icon} {type}
                </span>
                <div className={styles.inputWrapper}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handlePassengerInput(type, passengers[type] - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={passengers[type] === 0 ? "" : passengers[type]}
                    onChange={(e) => handlePassengerInput(type, e.target.value)}
                    className={styles.passengerInput}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        const defaultValue = type === "Adult" ? 1 : 0;
                        handlePassengerInput(type, defaultValue);
                      }
                    }}
                    placeholder={type === "Adult" ? "1" : "0"}
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={() =>
                      handlePassengerInput(type, passengers[type] + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SearchTable
          selectedWay={selectedWay}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          multiCityRoutes={multiCityRoutes}
          removeMultiCityRoute={removeMultiCityRoute}
          addMultiCityRoute={addMultiCityRoute}
        />
      </div>
    </div>
  );
};

export default Booking;
