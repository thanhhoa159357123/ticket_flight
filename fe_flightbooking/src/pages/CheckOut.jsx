// CheckOut.jsx
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const CheckOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  // Destructure dữ liệu từ Booking (hỗ trợ cả vé một chiều và khứ hồi)
  const {
    isRoundTrip,
    dat_ve,
    dat_ve_return,
    flight,
    returnFlight,
    selectedPackage,
    returnPackage,
    passengers,
    selectedLuggage,
  } = state;

  console.log("CheckOut data:", state);

  const handleCancelBooking = async () => {
    if (!dat_ve?.ma_dat_ve) {
      alert("Không tìm thấy mã đặt vé.");
      return;
    }

    const confirmCancel = window.confirm("Bạn có chắc muốn hủy vé?");
    if (!confirmCancel) return;

    try {
      // Hủy đơn đặt vé chính
      await axios.delete(
        `http://localhost:8000/api/dat-ve/${dat_ve.ma_dat_ve}`
      );

      // Hủy đơn đặt vé chuyến về nếu có (cho trường hợp có 2 đơn riêng)
      if (dat_ve_return?.ma_dat_ve && dat_ve_return.ma_dat_ve !== dat_ve.ma_dat_ve) {
        await axios.delete(
          `http://localhost:8000/api/dat-ve/${dat_ve_return.ma_dat_ve}`
        );
      }

      alert("Đã hủy vé thành công.");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      alert("Hủy vé thất bại.");
    }
  };

  const calculateTotal = () => {
    const outboundPrice = selectedPackage?.gia || flight?.gia || 0;
    const returnPrice = isRoundTrip ? (returnPackage?.gia || returnFlight?.gia || 0) : 0;
    const luggagePrice = selectedLuggage?.price || 0;
    const totalFlightPrice = outboundPrice + returnPrice;
    return (totalFlightPrice + luggagePrice) * (passengers?.length || 1);
  };

  const formatTime = (datetime) => dayjs(datetime).format("HH:mm");
  const formatDate = (datetime) => dayjs(datetime).format("DD/MM/YYYY");

  // Component hiển thị thông tin chuyến bay
  const FlightInfoCard = ({ flightData, packageData, title, bgColor = "bg-blue-600" }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4">
      <div className={`${bgColor} px-6 py-3`}>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Hãng bay</p>
            <p className="font-medium">{flightData?.ten_hang_bay || "--"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Số hiệu</p>
            <p className="font-medium">{flightData?.so_hieu || "--"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Điểm đi</p>
            <p className="font-medium">{flightData?.ten_san_bay_di || flightData?.ma_san_bay_di || "--"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Điểm đến</p>
            <p className="font-medium">{flightData?.ten_san_bay_den || flightData?.ma_san_bay_den || "--"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Giờ đi</p>
            <p className="font-medium">
              {formatTime(flightData?.gio_di)} - {formatDate(flightData?.gio_di)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Giờ đến</p>
            <p className="font-medium">
              {formatTime(flightData?.gio_den)} - {formatDate(flightData?.gio_den)}
            </p>
          </div>
        </div>
        
        {/* Thông tin gói vé */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Gói vé</p>
              <p className="font-medium">{packageData?.goi_ve || flightData?.vi_tri_ngoi || "--"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Giá vé</p>
              <p className="text-lg font-bold text-blue-600">
                {(packageData?.gia || flightData?.gia || 0).toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Xác nhận đặt vé {isRoundTrip ? "khứ hồi" : "một chiều"}
          </h1>
          <p className="text-gray-600 mt-2">
            Vui lòng kiểm tra lại thông tin trước khi thanh toán
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Info */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-blue-600 px-6 py-3">
                <h2 className="text-xl font-semibold text-white">
                  Thông tin đặt vé
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mã đặt vé chính</p>
                    <p className="font-medium">{dat_ve?.ma_dat_ve || "--"}</p>
                  </div>
                  {dat_ve_return && (
                    <div>
                      <p className="text-sm text-gray-500">Mã đặt vé phụ</p>
                      <p className="font-medium">{dat_ve_return?.ma_dat_ve || "--"}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Loại chuyến</p>
                    <p className="font-medium">{isRoundTrip ? "Khứ hồi" : "Một chiều"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số hành khách</p>
                    <p className="font-medium">{passengers?.length || 0} người</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Info - Chuyến đi */}
            <FlightInfoCard 
              flightData={flight} 
              packageData={selectedPackage}
              title="Chuyến đi"
              bgColor="bg-blue-600"
            />

            {/* Flight Info - Chuyến về (chỉ hiển thị khi là vé khứ hồi) */}
            {isRoundTrip && returnFlight && (
              <FlightInfoCard 
                flightData={returnFlight} 
                packageData={returnPackage}
                title="Chuyến về"
                bgColor="bg-orange-600"
              />
            )}

            {/* Passengers */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-blue-600 px-6 py-3">
                <h2 className="text-xl font-semibold text-white">
                  Danh sách hành khách
                </h2>
              </div>
              <div className="p-6">
                {passengers?.map((p, index) => (
                  <div
                    key={index}
                    className={`mb-4 pb-4 ${
                      index !== passengers.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {index + 1}. {p.danh_xung} {p.ho_hanh_khach}{" "}
                          {p.ten_hanh_khach}
                        </p>
                        <p className="text-sm text-gray-600">
                          Ngày sinh: {p.ngay_sinh}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quốc tịch: {p.quoc_tich}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Luggage */}
            {selectedLuggage && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-blue-600 px-6 py-3">
                  <h2 className="text-xl font-semibold text-white">Hành lý</h2>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedLuggage.label}</p>
                    </div>
                    {selectedLuggage.price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Phí hành lý</p>
                        <p className="text-lg font-bold text-blue-600">
                          {selectedLuggage.price.toLocaleString()}đ
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 sticky top-6">
              <div className="bg-blue-600 px-6 py-3">
                <h2 className="text-xl font-semibold text-white">
                  Tổng thanh toán
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Giá chuyến đi */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vé chuyến đi</span>
                    <span className="font-medium">
                      {(selectedPackage?.gia || flight?.gia || 0).toLocaleString()}đ ×{" "}
                      {passengers?.length || 1}
                    </span>
                  </div>

                  {/* Giá chuyến về (nếu có) */}
                  {isRoundTrip && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vé chuyến về</span>
                      <span className="font-medium">
                        {(returnPackage?.gia || returnFlight?.gia || 0).toLocaleString()}đ ×{" "}
                        {passengers?.length || 1}
                      </span>
                    </div>
                  )}

                  {/* Hành lý */}
                  {selectedLuggage?.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hành lý</span>
                      <span className="font-medium">
                        {(selectedLuggage.price || 0).toLocaleString()}đ ×{" "}
                        {passengers?.length || 1}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-blue-600">
                        {calculateTotal().toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <Link
                    to="/booking"
                    state={state} // Truyền lại toàn bộ state
                    className="block text-center text-blue-600 hover:text-blue-800 px-4 py-3 rounded-xl font-semibold cursor-pointer border border-blue-600 hover:border-blue-800 transition"
                  >
                    Quay lại
                  </Link>

                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold cursor-pointer transition"
                    onClick={handleCancelBooking}
                  >
                    Hủy vé
                  </button>

                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold cursor-pointer transition"
                    onClick={() =>
                      navigate("/payment", {
                        state: state, // Truyền toàn bộ state cho Payment
                      })
                    }
                  >
                    Thanh toán {calculateTotal().toLocaleString()}đ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
