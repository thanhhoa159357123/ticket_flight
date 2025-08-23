// fe_flightbooking/src/services/BookingPageService.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const bookingService = {
  createDatVe: async (datVeData) => {
    const response = await axios.post(`${API_BASE_URL}/datve`, datVeData);
    return response.data.datve;
  },

  createPassenger: async (passengerData) => {
    const response = await axios.post(
      ` ${API_BASE_URL}/hanhkhach`,
      passengerData
    );
    return response.data.hanh_khach;
  },
  createTicketDetail: async (ticketDetailData) => {
    const response = await axios.post(
      ` ${API_BASE_URL}/chitietdatve`,
      ticketDetailData
    );
    return response.data.chi_tiet_ve_list;
  },
  createPassengers: async (passengerList) => {
    const hanhKhachResponses = await Promise.all(
      passengerList.map(async (p) => {
        const ngay_sinh = `${p.yyyy}-${p.mm.padStart(2, "0")}-${p.dd.padStart(
          2,
          "0"
        )}`;
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

  processBooking: async (bookingData) => {
    const {
      passengerList,
      selectedPackage,
      returnPackage,
      flight,
      returnFlight,
      isRoundTrip,
    } = bookingData;
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const maKhachHang = userData?.ma_khach_hang;
    if (!maKhachHang) {
      throw new Error(
        "Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại."
      );
    } // 🔧 Chuyển thành mảng cho model mới
    const maHangVeList = [
      selectedPackage?.ma_hang_ve || selectedPackage?.ma_ve,
    ];
    const maChuyenBayList = [flight?.ma_chuyen_bay];
    if (isRoundTrip && returnPackage && returnFlight) {
      maHangVeList.push(returnPackage?.ma_hang_ve || returnPackage?.ma_ve);
      maChuyenBayList.push(returnFlight?.ma_chuyen_bay);
    }

    // Chuẩn hóa payload cho datve
    const datVePayload = {
      ngay_dat: new Date().toISOString(),
      trang_thai: "Đang xử lý",
      ma_khach_hang: maKhachHang,
      loai_chuyen_di: isRoundTrip ? "Khứ hồi" : "Một chiều",
      ma_hang_ve: isRoundTrip ? maHangVeList : maHangVeList[0],
      ma_chuyen_bay: isRoundTrip ? maChuyenBayList : maChuyenBayList[0],
    };

    const datVeOutbound = await bookingService.createDatVe(datVePayload);
    const passengers = await bookingService.createPassengers(passengerList);

    // 3️⃣ Tạo chi tiết vé
    const maVeList = [selectedPackage?.ma_ve || selectedPackage?.ma_hang_ve];
    if (isRoundTrip && returnPackage) {
      maVeList.push(returnPackage?.ma_ve || returnPackage?.ma_hang_ve);
    }

    const payload = {
      ma_dat_ve: datVeOutbound.ma_dat_ve,
      ma_ve: maVeList, // ← Gửi mảng 2 mã vé
      ma_hanh_khach: passengers.map((hk) => hk.ma_hanh_khach),
    };
    const chiTietVeDat = await bookingService.createTicketDetail(payload);

    return {
      passengers,
      chiTietVeDat,
      datVeOutbound,
    };
  },
};
