import React from "react";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Thanh toán thành công!</h1>
        <p>Cảm ơn bạn đã đặt vé. Chúng tôi sẽ gửi thông tin chi tiết qua email.</p>
      </div>
    </div>
  );
};

export default Success;
