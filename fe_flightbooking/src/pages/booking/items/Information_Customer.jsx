import React, { useState } from "react";
import NameGuidePopover from "./NameGuidePopover";

const Information_Customer = ({ passengers, onChangePassenger }) => {
  const [showGuide, setShowGuide] = useState(false);

  // const handleChange = (index, field, value) => {
  //   const updatedPassenger = { ...passengers[index], [field]: value };
  //   onChangePassenger(index, updatedPassenger);
  // };

  // const handleDateChange = (index, part, value) => {
  //   const dateParts = passengers[index].ngay_sinh?.split("-") || ["", "", ""];
  //   if (part === "day") dateParts[2] = value.padStart(2, "0");
  //   if (part === "month") dateParts[1] = value.padStart(2, "0");
  //   if (part === "year") dateParts[0] = value;
  //   const newDate = dateParts.join("-");
  //   handleChange(index, "ngay_sinh", newDate);
  // };

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md border border-gray-200 px-6 py-5">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3">
          Thông tin hành khách
        </h2>
        <div className="bg-blue-50 text-blue-800 p-3 mt-4 rounded-md text-sm border-l-4 border-blue-500 flex flex-col gap-1">
          <strong className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Vui lòng chú ý:
          </strong>
          <p>Bạn phải nhập chính xác tên như trong CCCD của mình.</p>
          <div className="inline-block relative mt-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowGuide(!showGuide);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex cursor-pointer items-center gap-1"
            >
              Xem hướng dẫn nhập tên
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <NameGuidePopover
              show={showGuide}
              onClose={() => setShowGuide(false)}
            />
          </div>
        </div>
      </div>

      {passengers.map((p, i) => (
        <div key={`${p.loai}-${i}`} className="mb-8 last:mb-0">
          <div className={`font-medium py-2 px-4 mb-4 rounded-lg ${
            p.loai === "Adult" ? "bg-blue-100 text-blue-800" :
            p.loai === "Children" ? "bg-purple-100 text-purple-800" :
            "bg-pink-100 text-pink-800"
          }`}>
            {p.loai === "Adult"
              ? `Người lớn ${i + 1}`
              : p.loai === "Children"
              ? `Trẻ em ${i + 1}`
              : `Trẻ sơ sinh ${i + 1}`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Danh xưng */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh xưng <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={p.danh_xung}
                  onChange={(e) =>
                    onChangePassenger(i, { danh_xung: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn danh xưng</option>
                  <option>Ông</option>
                  <option>Bà</option>
                  <option>Cô</option>
                  <option>Chú</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty column for alignment */}
            <div className="hidden md:block"></div>

            {/* Họ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ (vd: Nguyen) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={p.ho_hanh_khach}
                onChange={(e) =>
                  onChangePassenger(i, { ho_hanh_khach: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập họ của bạn"
              />
              <p className="text-xs text-gray-500 mt-1">
                Như trên CMND (không dấu)
              </p>
            </div>

            {/* Tên đệm & tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Đệm & Tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={p.ten_hanh_khach}
                onChange={(e) =>
                  onChangePassenger(i, { ten_hanh_khach: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên của bạn"
              />
              <p className="text-xs text-gray-500 mt-1">
                Như trên CMND (không dấu)
              </p>
            </div>

            {/* Ngày sinh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="DD"
                  maxLength="2"
                  className="w-1/3 border border-gray-300 rounded-lg px-2 py-2.5 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={p.dd}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onChangePassenger(i, { dd: value });
                    if (value.length === 2) {
                      document.getElementById(`month-${i}`).focus();
                    }
                  }}
                />
                <input
                  id={`month-${i}`}
                  type="text"
                  placeholder="MM"
                  maxLength="2"
                  className="w-1/3 border border-gray-300 rounded-lg px-2 py-2.5 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={p.mm}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onChangePassenger(i, { mm: value });
                    if (value.length === 2) {
                      document.getElementById(`year-${i}`).focus();
                    }
                  }}
                />
                <input
                  id={`year-${i}`}
                  type="text"
                  placeholder="YYYY"
                  maxLength="4"
                  className="w-1/3 border border-gray-300 rounded-lg px-2 py-2.5 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={p.yyyy}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    onChangePassenger(i, { yyyy: value });
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {p.loai === "Adult"
                  ? "Hành khách người lớn (trên 12 tuổi)"
                  : p.loai === "Children"
                  ? "Trẻ em từ 2 đến 12 tuổi"
                  : "Trẻ sơ sinh dưới 2 tuổi"}
              </p>
            </div>

            {/* Quốc tịch */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quốc tịch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={p.quoc_tich}
                  onChange={(e) =>
                    onChangePassenger(i, { quoc_tich: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn quốc tịch</option>
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Hoa Kỳ">Hoa Kỳ</option>
                  <option value="Nhật Bản">Nhật Bản</option>
                  <option value="Hàn Quốc">Hàn Quốc</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-1">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Information_Customer;