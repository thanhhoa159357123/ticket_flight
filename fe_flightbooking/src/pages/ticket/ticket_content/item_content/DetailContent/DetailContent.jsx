import React from "react";
import styles from "./DetailContent.module.scss";
import LuggageIcon from "@mui/icons-material/Luggage";
import WorkIcon from "@mui/icons-material/Work";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import AirlineSeatLegroomReducedIcon from "@mui/icons-material/AirlineSeatLegroomReduced";

const DetailContent = () => {
  return (
    <div className={styles.detailContent}>
      <div className={styles.leftColumn}>
        <div className={styles.timeBlock}>
          <strong className={styles.time}>20:05</strong>
          <span className={styles.date}>28 thg 5</span>
        </div>
        <div className={styles.duration}>
          <span className={styles.durationText}>2h 5m</span>
          <div className={styles.flightType}>Bay thẳng</div>
        </div>
        <div className={styles.timeBlock}>
          <strong className={styles.time}>22:10</strong>
          <span className={styles.date}>28 thg 5</span>
        </div>
      </div>
      {/* Thêm div chứa đường kẻ dọc */}
      <div className={styles.divider}></div>
      <div className={styles.rightColumn}>
        <div className={styles.sectionTop}>
          <div className={styles.location}>
            <strong>TP HCM (SGN)</strong>
            <span className={styles.terminal}>
              Sân bay Tân Sơn Nhất - Nhà ga 1
            </span>
          </div>
        </div>

        <div className={styles.flightDetails}>
          <div className={styles.airlineSection}>
            <div className={styles.airlineHeader}>
              <span className={styles.airlineName}>VietJet Air</span>
              <span className={styles.flightNumber}>VJ-1176 - Khuyến mãi</span>
            </div>

            <div className={styles.detailGrid}>
              {/* Hàng 1 - Thông tin hành lý */}
              <div className={styles.detailItem}>
                <LuggageIcon className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Hành lý ký gửi</div>
                  <div className={styles.detailValue}>0 kg</div>
                </div>
              </div>

              <div className={styles.detailItem}>
                <WorkIcon className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Hành lý xách tay</div>
                  <div className={styles.detailValue}>7 kg</div>
                </div>
              </div>

              {/* Hàng 2 - Thông tin máy bay */}
              <div className={styles.detailItem}>
                <AirlinesIcon className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Loại máy bay</div>
                  <div className={styles.detailValue}>Airbus A321</div>
                </div>
              </div>

              <div className={styles.detailItem}>
                <AirlineSeatReclineNormalIcon className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Sơ đồ ghế</div>
                  <div className={styles.detailValue}>3-3</div>
                </div>
              </div>

              {/* Hàng 3 - Thông tin khác */}
              <div className={styles.detailItem}>
                <AirlineSeatLegroomReducedIcon className={styles.detailIcon} />
                <div>
                  <div className={styles.detailLabel}>Khoảng cách ghế</div>
                  <div className={styles.detailValue}>
                    28" (dưới tiêu chuẩn)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBot}>
          <div className={styles.location}>
            <strong>Hà Nội (HAN)</strong>
            <span className={styles.terminal}>Sân bay Nội Bài - Nhà ga 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailContent;
