import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketService } from "../services/DetailTicketService";
import axios from "axios";

export const useTicketActions = (onClose) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCancelBooking = async (ticket) => {
    if (!ticket?.ma_dat_ve) {
      alert("Không tìm thấy mã đặt vé.");
      return;
    }

    const confirmCancel = window.confirm("Bạn có chắc muốn hủy vé?");
    if (!confirmCancel) return;

    try {
      await ticketService.cancelBooking(ticket.ma_dat_ve);
      alert("Đã hủy vé thành công.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      alert("Hủy vé thất bại.");
    }
  };

  const handlePayment = async (ticket) => {
    try {
      const paymentData = await ticketService.getPaymentData(ticket);
      
      if (paymentData.chiTietVeDat.length === 0) {
        throw new Error("Không tìm thấy chi tiết vé đặt.");
      }

      const passengers = ticket.passengers || [];
      if (passengers.length === 0) {
        alert("Không tìm thấy hành khách trong đơn đặt vé.");
        return;
      }

      const isRoundTrip = ticket.loai_chuyen_di === "Khứ hồi";
      
      const checkoutState = {
        isRoundTrip,
        dat_ve: { ma_dat_ve: ticket.ma_dat_ve },
        ...paymentData,
        passengers,
        ...(isRoundTrip && {
          chiTietVeReturn: paymentData.chiTietVeDat
        })
      };

      navigate("/checkout", { state: checkoutState });
    } catch (err) {
      console.error("❌ Lỗi khi xử lý thanh toán:", err);
      alert("Không thể tiếp tục thanh toán. Vui lòng thử lại.");
    }
  };

  const handleRefundTicket = async (ticket) => {
    if (!ticket?.ma_dat_ve) {
      alert("❌ Không tìm thấy mã đặt vé.");
      return;
    }

    const confirmMessage = `Bạn có chắc chắn muốn yêu cầu hoàn vé ${ticket.ma_dat_ve}?

⚠️ Lưu ý:
• Yêu cầu sẽ được gửi đến bộ phận xử lý
• Thời gian xử lý: 24-48 giờ làm việc
• Có thể áp dụng phí hoàn vé theo quy định
• Bạn sẽ nhận được thông báo khi có kết quả`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);
    try {
      console.log(`🚀 Đang gửi yêu cầu hoàn vé cho ${ticket.ma_dat_ve}...`);
      
      const response = await axios.patch(
        `http://localhost:8000/api/dat-ve/${ticket.ma_dat_ve}/refund`,
        {},
        {
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Response thành công:', response.data);
      
      alert(`✅ ${response.data.message}

📋 Thông tin chi tiết:
• Mã đặt vé: ${response.data.ma_dat_ve}
• Khách hàng: ${response.data.khach_hang}
• Hạng vé: ${response.data.hang_ve}
• Trạng thái: ${response.data.trang_thai_moi}
• Thời gian xử lý: ${response.data.thoi_gian_xu_ly}

📞 Liên hệ hotline: 1900-xxxx nếu cần hỗ trợ`);
      
      onClose();
      window.location.reload();
      
    } catch (error) {
      console.error('❌ Chi tiết lỗi yêu cầu hoàn vé:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi gửi yêu cầu hoàn vé';
      
      if (error.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail;
        
        switch (status) {
          case 400:
            // ✅ 400 là do không đủ điều kiện hoàn vé (business logic)
            errorMessage = detail || 'Vé này không đủ điều kiện hoàn';
            break;
          case 404:
            errorMessage = 'Không tìm thấy mã đặt vé';
            break;
          case 500:
            errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau hoặc liên hệ hotline';
            break;
          default:
            errorMessage = detail || `Lỗi server (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
      } else {
        errorMessage = error.message || 'Có lỗi không xác định xảy ra';
      }
      
      // ✅ Khác biệt thông báo cho case 400 vs các lỗi khác
      const isBusinessLogicError = error.response?.status === 400;
      
      if (isBusinessLogicError) {
        // Thông báo đơn giản cho lỗi business logic
        alert(`❌ ${errorMessage}

📞 Liên hệ hotline: 1900-xxxx để được hỗ trợ`);
      } else {
        // Thông báo đầy đủ cho lỗi kỹ thuật
        alert(`❌ ${errorMessage}

🔧 Hướng dẫn:
• Kiểm tra kết nối mạng
• Thử lại sau ít phút
• Liên hệ hotline: 1900-xxxx nếu vẫn gặp lỗi`);
      }
      
    } finally {
      setLoading(false);
      console.log('🏁 Hoàn thành xử lý yêu cầu hoàn vé');
    }
  };

  return {
    handleCancelBooking,
    handlePayment,
    handleRefundTicket,
    loading
  };
};