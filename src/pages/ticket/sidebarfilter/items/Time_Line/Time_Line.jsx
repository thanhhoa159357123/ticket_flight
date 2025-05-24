import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./Time_Line.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// eslint-disable-next-line react-refresh/only-export-components
const TimeOption = ({ title, timeSlots }) => {
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeClick = (index) => {
    setSelectedTime(selectedTime === index ? null : index);
  };

  return (
    <div className={styles.TimeOption}>
      <span>{title}</span>
      <div className={styles.BoxTime}>
        {timeSlots.map((item, index) => (
          <div
            key={index}
            className={`${styles.ContentBoxTime} ${
              selectedTime === index ? styles.selected : ""
            }`}
            onClick={() => handleTimeClick(index)}
          >
            <span>{item.period}</span>
            <span>{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeRangeSlider = () => {
  const [range, setRange] = useState([0, 12]);

  return (
    <div className={styles.TimeRangeSlider}>
      <div className={styles.TimeRangeLabel}>
        <span>Thời gian bay</span>
        <span>
          {range[0]}h - {range[1]}h
        </span>
      </div>
      <div className={styles.SliderContainer}>
        <Slider.Range
          min={0}
          max={12}
          step={1}
          defaultValue={[0, 12]}
          onChange={(val) => setRange(val)}
        />
      </div>
      <div className={styles.TimeRangeTicks}>
        <span>0h</span>
        <span>12h</span>
      </div>
    </div>
  );
};

const Time_Line = () => {
  const [isTimeLineOpen, setIsTimeLineOpen] = useState(true);

  const timeData = [
    { period: "Đêm đến sáng", time: "00:00 - 06:00" },
    { period: "Sáng đến trưa", time: "06:00 - 12:00" },
    { period: "Trưa đến tối", time: "12:00 - 18:00" },
    { period: "Tối đến đêm", time: "18:00 - 24:00" },
  ];

  return (
    <div className={styles.TimeLine}>
      <div
        className={styles.TimeLine__Title}
        onClick={() => setIsTimeLineOpen(!isTimeLineOpen)}
      >
        <div>Thời gian bay</div>
        <KeyboardArrowUpIcon
          className={`${styles.arrowIcon} ${isTimeLineOpen ? styles.rotate : ""}`}
        />
      </div>

      <div 
        className={`${styles.TimeLine__OptionContent} ${
          isTimeLineOpen ? styles.open : styles.closed
        }`}
      >
        <TimeOption title="Giờ cất cánh" timeSlots={timeData} />
        <TimeOption title="Giờ hạ cánh" timeSlots={timeData} />
        <TimeRangeSlider />
      </div>
    </div>
  );
};

export default Time_Line;
