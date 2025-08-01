import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Service xử lý đặt vé
export const ticketService = {
  // Hủy đặt vé
  cancelBooking: async (maDatVe) => {
    await axios.delete(`${API_BASE_URL}/dat-ve/${maDatVe}`);
  },

  // Lấy chi tiết vé đặt
  getTicketDetails: async (maDatVe) => {
    const response = await axios.get(`${API_BASE_URL}/chi-tiet-ve-dat/by-ma-dat-ve/${maDatVe}`);
    return response.data?.chi_tiet_ve_list || [];
  },

  // Lấy thông tin chuyến bay
  getFlightInfo: async (maChuyenBay) => {
    if (!maChuyenBay) return null;
    const response = await axios.get(`${API_BASE_URL}/chuyen-bay/${maChuyenBay}`);
    return response.data;
  },

  // Lấy thông tin gói vé
  getPackageInfo: async (maHangVe) => {
    if (!maHangVe) return null;
    const response = await axios.get(`${API_BASE_URL}/hang-ve/${maHangVe}`);
    return response.data;
  },

  // Lấy thông tin hành lý
  getLuggageInfo: async (maDatVe) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hanh-ly/by-ma-dat-ve/${maDatVe}`);
      return response.data || null;
    } catch (err) {
      console.warn("Không tìm thấy thông tin hành lý.", err);
      return null;
    }
  },

  // Lấy đầy đủ thông tin thanh toán
  getPaymentData: async (ticket) => {
    const isRoundTrip = ticket.loai_chuyen_di === "Khứ hồi";
    
    // Fetch data song song
    const [
      chiTietVeDat,
      flight,
      selectedPackage,
      returnFlight,
      returnPackage,
      selectedLuggage
    ] = await Promise.allSettled([
      ticketService.getTicketDetails(ticket.ma_dat_ve),
      ticketService.getFlightInfo(ticket.ma_chuyen_di),
      ticketService.getPackageInfo(ticket.ma_hang_ve_di),
      isRoundTrip ? ticketService.getFlightInfo(ticket.ma_chuyen_ve) : null,
      isRoundTrip ? ticketService.getPackageInfo(ticket.ma_hang_ve_ve) : null,
      ticketService.getLuggageInfo(ticket.ma_dat_ve)
    ]);

    // Xử lý kết quả
    const result = {
      chiTietVeDat: chiTietVeDat.status === "fulfilled" ? chiTietVeDat.value : [],
      flight: flight.status === "fulfilled" ? flight.value : null,
      selectedPackage: selectedPackage.status === "fulfilled" ? selectedPackage.value : null,
      selectedLuggage: selectedLuggage.status === "fulfilled" ? selectedLuggage.value : null,
    };

    if (isRoundTrip) {
      result.returnFlight = returnFlight?.status === "fulfilled" ? returnFlight.value : null;
      result.returnPackage = returnPackage?.status === "fulfilled" ? returnPackage.value : null;
    }

    return result;
  }
};