import React, { useState } from "react";
import styles from "./FilterContent.module.scss";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const FilterContent = () => {
  const [isShowOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const options = [
    "Ưu tiên bay thẳng",
    "Cất cánh sớm nhất",
    "Cất cánh muộn nhất",
    "Hạ cánh sớm nhất",
    "Hạ cánh muộn nhất",
  ];

  const toggleOptions = () => {
    setShowOptions(!isShowOptions);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    // Thêm logic xử lý filter tại đây
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterWrapper}>
        <div className={`${styles.filterCard} ${styles.highlightCard}`}>
          <span className={styles.filterLabel}>Giá thấp nhất</span>
          <span className={styles.filterValue}>1.813.410 VND</span>
          <span className={styles.filterSubText}>2h 10m</span>
        </div>

        <div className={styles.filterCard}>
          <span className={styles.filterLabel}>Thời gian bay ngắn nhất</span>
          <span className={styles.filterValue}>3.813.410 VND</span>
          <span className={styles.filterSubText}>2h 0m</span>
        </div>

        <div className={styles.filterOptionContainer}>
          <div 
            className={`${styles.filterCard} ${styles.filterOption}`} 
            onClick={toggleOptions}
          >
            <div className={styles.optionContent}>
              <FilterAltIcon className={styles.filterIcon} />
              <span className={styles.optionText}>
                {selectedOption || "Khác"}
              </span>
              {isShowOptions ? (
                <ExpandLessIcon className={styles.expandIcon} />
              ) : (
                <ExpandMoreIcon className={styles.expandIcon} />
              )}
            </div>
          </div>
          
          {isShowOptions && (
            <div className={styles.optionsDropdown}>
              {options.map((option, index) => (
                <div 
                  key={index} 
                  className={`${styles.optionItem} ${
                    selectedOption === option ? styles.selected : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterContent;