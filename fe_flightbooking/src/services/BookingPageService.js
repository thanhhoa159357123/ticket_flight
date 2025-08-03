import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const bookingService = {
  // Tạo hành khách
  createPassenger: async (passengerData) => {
    const response = await axios.post(`${API_BASE_URL}/hanh-khach`, passengerData);
    return response.data.hanh_khach;
  },

  // Tạo chi tiết vé
  createTicketDetail: async (ticketDetailData) => {
    const response = await axios.post(`${API_BASE_URL}/chi-tiet-ve-dat`, ticketDetailData);
    return response.data.chi_tiet_ve;
  },

  // Tạo danh sách hành khách
  createPassengers: async (passengerList) => {
    const hanhKhachResponses = await Promise.all(
      passengerList.map(async (p) => {
        const ngay_sinh = `${p.yyyy}-${p.mm.padStart(2, "0")}-${p.dd.padStart(2, "0")}`;
        const passengerPayload = {
          danh_xung: p.danh_xung,
          ho_hanh_khach: p.ho_hanh_khach,
          ten_hanh_khach: p.ten_hanh_khach,
          ngay_sinh,
          quoc_tich: p.quoc_tich,
        };

        return await bookingService.createPassenger(passengerPayload);
      })
    );
    return hanhKhachResponses;
  },

  // Tạo chi tiết vé cho chuyến
  createTicketDetails: async (passengers, maDatVe, packageOrFlight) => {
    const chiTietVeResponses = await Promise.all(
      passengers.map(async (hk) => {
        const payload = {
          ma_dat_ve: maDatVe,
          ma_gia_ve: packageOrFlight?.ma_gia_ve,
          ma_hanh_khach: hk.ma_hanh_khach,
        };
        return await bookingService.createTicketDetail(payload);
      })
    );
    return chiTietVeResponses;
  },

  // Xử lý đặt vé hoàn chỉnh
  processBooking: async (bookingData) => {
    const {
      passengerList,
      maDatVe,
      maDatVeReturn,
      selectedPackage,
      returnPackage,
      flight,
      returnFlight,
      isRoundTrip,
    } = bookingData;

    // 1. Tạo hành khách
    const passengers = await bookingService.createPassengers(passengerList);

    // 2. Chi tiết vé cho chuyến đi
    const chiTietVeDat = await bookingService.createTicketDetails(
      passengers,
      maDatVe,
      selectedPackage || flight
    );

    // 3. Chi tiết vé cho chuyến về (nếu có)
    let chiTietVeReturn = [];
    if (isRoundTrip && returnFlight && returnPackage) {
      const maDatVeForReturn = maDatVeReturn || maDatVe;
      chiTietVeReturn = await bookingService.createTicketDetails(
        passengers,
        maDatVeForReturn,
        returnPackage || returnFlight
      );
    }

    return {
      passengers,
      chiTietVeDat,
      chiTietVeReturn,
    };
  },
};