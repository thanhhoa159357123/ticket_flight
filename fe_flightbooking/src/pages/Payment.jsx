import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dat_ve, flight, passengers, selectedLuggage } = location.state || {};

  const calculateTotal = () => {
    const flightPrice = flight?.gia || 0;
    const luggagePrice = selectedLuggage?.price || 0;
    return (flightPrice + luggagePrice) * (passengers?.length || 1);
  };

  const onPaymentSuccess = async (details) => {
    try {
      const hoaDonPayload = {
        ma_hoa_don: "", // tạo ở backend
        ngay_thanh_toan: new Date().toISOString().split('T')[0],
        tong_tien: calculateTotal(),
        phuong_thuc: "PayPal",
        ghi_chu: `Thanh toán bởi ${details.payer.name.given_name}`,
        ma_dat_ve: dat_ve.ma_dat_ve,
      };

      await axios.post(
        "http://localhost:8000/api/hoa-don/thanh-toan",
        hoaDonPayload
      );

      alert("🎉 Thanh toán thành công!");
      navigate("/success");
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật thanh toán:", error);
      alert("Thanh toán thành công nhưng cập nhật thất bại.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Thanh toán với PayPal
        </h2>

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
                      value: (calculateTotal() / 24000).toFixed(0), // từ VNĐ sang USD
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
  );
};

export default Payment;
