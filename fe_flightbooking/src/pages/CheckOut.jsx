// CheckOut.jsx
import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking = {} } = location.state || {};
  const {
    passengers,
    datVeOutbound,
    datVeReturn,
    selectedPackage,
    flight,
    returnFlight,
    returnPackage,
    isRoundTrip,
    selectedLuggage,
  } = booking;
  const state = { booking };
  console.log("🚀 ~ file: CheckOut.jsx:7 ~ CheckOut ~ booking:", booking);

  const [loading, setLoading] = React.useState(false);

  const handleCancelBooking = async () => {
    if (!datVeOutbound?.ma_dat_ve) {
      alert("Không tìm thấy mã đặt vé.");
      return;
    }
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy vé?");
    if (!confirmCancel) return;
    setLoading(true);
    try {
      await axios.delete(
        `http://localhost:8000/api/dat-ve/${datVeOutbound.ma_dat_ve}`
      );
      if (
        datVeReturn?.ma_dat_ve &&
        datVeReturn.ma_dat_ve !== datVeOutbound.ma_dat_ve
      ) {
        await axios.delete(
          `http://localhost:8000/api/dat-ve/${datVeReturn.ma_dat_ve}`
        );
      }
      alert("Đã hủy vé thành công.");
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      alert("Hủy vé thất bại.");
    }
    setLoading(false);
  };

  // Tính tổng tiền (giống logic Payment)
  const calculateTotal = () => {
    const outboundPrice = selectedPackage?.gia_ve || flight?.gia_ve || 0;
    const returnPrice = isRoundTrip
      ? returnPackage?.gia_ve || returnFlight?.gia_ve || 0
      : 0;
    const luggagePrice = selectedLuggage?.price || 0;
    const totalFlightPrice = outboundPrice + returnPrice;
    return (totalFlightPrice + luggagePrice) * (passengers?.length || 1);
  };

  // Hàm gọi API tạo hóa đơn khi thanh toán PayPal thành công
  const onPaymentSuccess = async (details) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const tongTien = calculateTotal();

      // Gửi hóa đơn
      const hoaDonPayload = {
        ma_hoa_don: "",
        ngay_thanh_toan: new Date().toISOString().split("T")[0],
        tong_tien: tongTien,
        phuong_thuc: "PayPal",
        ghi_chu: `Thanh toán bởi ${details.payer.name.given_name}`,
        ma_dat_ve: datVeOutbound?.ma_dat_ve,
      };
      await axios.post(
        "http://localhost:8000/hoadon/thanh-toan",
        hoaDonPayload
      );

      // Gửi vé điện tử
      await axios.post("http://localhost:8000/vedientu/send-full", null, {
        params: {
          ma_dat_ve: datVeOutbound.ma_dat_ve,
          email: userData?.email || "test@example.com",
        },
      });

      // Gửi vé điện tử khứ hồi nếu có
      if (
        isRoundTrip &&
        datVeReturn?.ma_dat_ve &&
        datVeReturn.ma_dat_ve !== datVeOutbound.ma_dat_ve
      ) {
        await axios.post("http://localhost:8000/vedientu/send-full", null, {
          params: {
            ma_dat_ve: datVeReturn.ma_dat_ve,
            email: userData?.email || "test@example.com",
          },
        });
      }

      alert("🎉 Thanh toán và gửi vé thành công!");
      navigate("/success");
    } catch (error) {
      console.error("❌ Lỗi sau khi thanh toán:", error);
      alert("Thanh toán thành công nhưng gửi vé thất bại.");
    }
  };

  const formatTime = (datetime) => dayjs(datetime).format("HH:mm");
  const formatDate = (datetime) => dayjs(datetime).format("DD/MM/YYYY");

  // Component hiển thị thông tin chuyến bay
  const FlightInfoCard = ({
    flightData,
    packageData,
    title,
    bgColor = "bg-blue-600",
  }) => (
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
            <p className="text-sm text-gray-500">Điểm đi</p>
            <p className="font-medium">
              Sân bay {flightData?.ten_san_bay_di || "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Điểm đến</p>
            <p className="font-medium">
              Sân bay {flightData?.ten_san_bay_den || "--"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian đi</p>
            <p className="font-medium">
              {formatTime(flightData?.thoi_gian_di)} -{" "}
              {formatDate(flightData?.thoi_gian_di)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Thời gian đến</p>
            <p className="font-medium">
              {formatTime(flightData?.thoi_gian_den)} -{" "}
              {formatDate(flightData?.thoi_gian_den)}
            </p>
          </div>
        </div>
        {/* Thông tin gói vé */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Gói vé</p>
              <p className="font-medium">
                {selectedPackage?.package_display ||
                  flightData?.ten_hang_ve ||
                  "--"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Giá vé</p>
              <p className="text-lg font-bold text-blue-600">
                {(
                  packageData?.gia_ve ||
                  flightData?.gia_ve ||
                  0
                ).toLocaleString()}
                đ
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
                    <p className="font-medium">
                      {datVeOutbound?.ma_dat_ve || "--"}
                    </p>
                  </div>
                  {datVeReturn && (
                    <div>
                      <p className="text-sm text-gray-500">Mã đặt vé phụ</p>
                      <p className="font-medium">
                        {datVeReturn?.ma_dat_ve || "--"}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Loại chuyến</p>
                    <p className="font-medium">
                      {isRoundTrip ? "Khứ hồi" : "Một chiều"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số hành khách</p>
                    <p className="font-medium">
                      {passengers?.length || 0} người
                    </p>
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
                          Ngày sinh:{" "}
                          {p.ngay_sinh
                            ? dayjs(p.ngay_sinh).format("DD/MM/YYYY")
                            : "--"}
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
                      {(
                        selectedPackage?.gia_ve ||
                        flight?.gia_ve ||
                        0
                      ).toLocaleString()}
                      đ × {passengers?.length || 1}
                    </span>
                  </div>

                  {/* Giá chuyến về (nếu có) */}
                  {isRoundTrip && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vé chuyến về</span>
                      <span className="font-medium">
                        {(
                          returnPackage?.gia_ve ||
                          returnFlight?.gia_ve ||
                          0
                        ).toLocaleString()}
                        đ × {passengers?.length || 1}
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
                    state={state}
                    className="block text-center text-blue-600 hover:text-blue-800 px-4 py-3 rounded-xl font-semibold cursor-pointer border border-blue-600 hover:border-blue-800 transition"
                  >
                    Quay lại
                  </Link>

                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold cursor-pointer transition"
                    onClick={handleCancelBooking}
                    disabled={loading}
                  >
                    {loading ? "Đang hủy..." : "Hủy vé"}
                  </button>

                  {/* PayPal thanh toán trực tiếp */}
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AcvhFjNIUde_7EnHDF0OI8LUAtBjd3OjEsohahEYWiJayGSt5BFW7NsPkC6QzpS8yM4tN63GY83JJOP7",
                      currency: "USD",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: (calculateTotal() / 24000).toFixed(0), // VNĐ sang USD
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then(onPaymentSuccess);
                      }}
                      onError={(err) => {
                        console.error("❌ PayPal Error:", err);
                        alert("Thanh toán thất bại.");
                      }}
                    />
                  </PayPalScriptProvider>
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
