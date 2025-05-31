import React, { useState } from "react";
import styles from "./utilities.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Luggage as LuggageIcon,
  Restaurant as RestaurantIcon,
  LiveTv as LiveTvIcon,
  Wifi as WifiIcon,
  Cable as CableIcon,
} from "@mui/icons-material";

const utilitiesData = [
  { id: "luggage", label: "Hành lý", icon: LuggageIcon },
  { id: "meal", label: "Suất ăn", icon: RestaurantIcon },
  { id: "entertainment", label: "Giải trí", icon: LiveTvIcon },
  { id: "wifi", label: "WiFi", icon: WifiIcon, disabled: true },
  { id: "charging", label: "Nguồn sạc / cổng USB", icon: CableIcon },
];

const Utilities = () => {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(true);
  const [selectedUtilities, setSelectedUtilities] = useState([]);

  const toggleUtility = (utility) => {
    setSelectedUtilities(prev => 
      prev.includes(utility) 
        ? prev.filter(item => item !== utility) 
        : [...prev, utility]
    );
  };

  return (
    <div className={styles.Utilities}>
      <div
        className={styles.Utilities__Title}
        onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
      >
        <div>Tiện ích</div>
        <KeyboardArrowUpIcon className={`${styles.arrowIcon} ${isUtilitiesOpen ? styles.rotate : ""}`} />
      </div>
      <div className={`${styles.Utilities__Content} ${isUtilitiesOpen ? styles.open : styles.closed}`}>
        {utilitiesData.map(({ id, label, icon: Icon, disabled }) => (
          <div
            key={id}
            className={`${styles.utilitiesRow} ${selectedUtilities.includes(id) ? styles.selected : ""} ${disabled ? styles.disabled : ""}`}
            onClick={() => !disabled && toggleUtility(id)}
          >
            <div className={styles.LeftRow}>
              <input
                type="checkbox"
                checked={selectedUtilities.includes(id)}
                disabled={disabled}
                readOnly
              />
              <span>{label}</span>
            </div>
            <Icon className={styles.RightRowIcon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Utilities;