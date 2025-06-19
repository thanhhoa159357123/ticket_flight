import React from "react";
import styles from "./TicketMoreDetail.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import LuggageIcon from "@mui/icons-material/Luggage";
import FlightIcon from "@mui/icons-material/Flight";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import BlockIcon from "@mui/icons-material/Block";
import WifiIcon from "@mui/icons-material/Wifi";
import ReceiptIcon from "@mui/icons-material/Receipt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import UsbIcon from "@mui/icons-material/Usb";

const TicketMoreDetail = ({ onClose, ticketType = "Nguyên bản", price = "2.814.578 VND" }) => {
  return (
    <div className={styles.ticketMoreDetail}>
      <div className={styles.header}>
        <CloseIcon className={styles.closeIcon} onClick={onClose} />
        <div className={styles.ticketInfo}>
          <div className={styles.ticketIcon}>
            <img itemid="bundle-detail-icon" importance="low" loading="lazy" src="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=h-128,q-75,w-128" srcset="https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=h-128,q-75,w-128 1x, https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=dpr-2,h-128,q-75,w-128 2x, https://ik.imagekit.io/tvlk/image/imageResource/2022/12/20/1671519137608-e21126746f9e50f8f36235df003b3fb2.png?tr=dpr-3,h-128,q-75,w-128 3x" decoding="async" width="128" height="128"/>
          </div>
          <div className={styles.ticketDetails}>
            <h3>{ticketType}</h3>
            <span className={styles.price}>{price}/khách</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h4>Hành lý</h4>
          <div className={styles.itemList}>
            <div className={styles.item}>
              <LuggageIcon className={styles.icon} />
              <span>Hành lý xách tay 7 kg</span>
            </div>
            <div className={styles.item}>
              <LuggageIcon className={styles.icon} />
              <span>Hành lý ký gửi 0 kg</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Vé linh hoạt</h4>
          <div className={styles.itemList}>
            <div className={styles.item}>
              <SwapHorizIcon className={styles.icon} />
              <div className={styles.itemContent}>
                <span>phí đổi lịch bay của hãng hàng không 378.000 VND</span>
                <button className={styles.detailArrow}>›</button>
              </div>
            </div>
            <div className={styles.item}>
              <BlockIcon className={styles.icon} />
              <div className={styles.itemContent}>
                <span>Không áp dụng hoàn vé</span>
                <button className={styles.detailArrow}>›</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Tiện nghi trên chuyến bay</h4>
          <div className={styles.itemList}>
            <div className={styles.item}>
              <RestaurantIcon className={styles.icon} />
              <span>Không có suất ăn trên máy bay</span>
            </div>
            <div className={styles.item}>
              <RestaurantIcon className={styles.icon} />
              <span>Không có giải trí trong chuyến bay</span>
            </div>
            <div className={styles.item}>
              <UsbIcon className={styles.icon} />
              <span>Không có nguồn & cổng USB</span>
            </div>
            <div className={styles.item}>
              <WifiIcon className={styles.icon} />
              <span>Không có WiFi</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Hóa đơn VAT</h4>
          <div className={styles.itemList}>
            <div className={styles.item}>
              <ReceiptIcon className={styles.icon} />
              <div className={styles.vatInfo}>
                <span>Có thể cung cấp hóa đơn VAT</span>
                <p>Với lựa chọn này, chúng tôi sẽ cung cấp hóa đơn VAT theo yêu cầu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.selectButton}>Chọn vé này</button>
      </div>
    </div>
  );
};

export default TicketMoreDetail;