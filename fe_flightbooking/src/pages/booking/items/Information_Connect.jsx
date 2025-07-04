import React from "react";
import { Link } from "react-router-dom";

const Information_Connect = () => {
  return (
    <div className="w-full max-w-4xl bg-[#f8fafc] rounded-[5px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-300 px-6 py-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">
          Thông tin liên hệ (nhận vé/phiếu thanh toán)
        </span>
        <Link to="/login">
          <button className="bg-[#4fc3f7] transition duration-200 ease cursor-pointer hover:bg-[#03a9f4] text-white font-medium py-2 px-4 rounded">
            Đăng nhập hoặc Đăng ký
          </button>
        </Link>
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Họ (vd: Nguyen){" "}
            <span className="font-semibold text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-200 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <label className="block text-sm font-medium mb-1">
            như trên CMND (không dấu)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tên Đệm & Tên (vd: Thi Ngoc Anh){" "}
            <span className="font-semibold text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-200 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <label className="block text-sm font-medium mb-1">
            như trên CMND (không dấu)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Điện thoại di động{" "}
            <span className="font-semibold text-red-500">*</span>
          </label>
          <div className="flex border border-gray-300 rounded transition duration-200 ease-in-out hover:border-gray-600">
            <select className="border border-gray-300 px-3 py-2 bg-white">
              <option value="+84">+84</option>
              {/* Bạn có thể thêm các mã quốc gia khác nếu muốn */}
            </select>
            <input
              type="text"
              className="flex-1 border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="VD: 901234567"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            VD: +84 901234567 trong đó (+84) là mã quốc gia và 901234567 là số
            di động
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="font-semibold text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-200 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <label className="block text-sm font-medium mb-1">
            VD: email@example.com
          </label>
        </div>
      </div>
    </div>
  );
};

export default Information_Connect;
