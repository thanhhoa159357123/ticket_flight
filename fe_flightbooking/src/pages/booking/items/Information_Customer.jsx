import React, { useState } from "react";
import NameGuidePopover from "./NameGuidePopover";

const Information_Customer = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="w-full max-w-4xl bg-[#f8fafc] rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-300 px-6 py-5">
      {/* Tiêu đề */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold border-b border-gray-300 pb-2">
          Thông tin hành khách
        </h2>
        <div className="bg-[#e3f2fd] text-[#0d47a1] p-3 mt-3 rounded-md text-sm border-l-4 border-blue-500">
          <strong>⚠️ Vui lòng chú ý cho những điều sau đây:</strong> <br />
          Bạn phải nhập chính xác tên như trong CCCD của mình. <br />
          <div className="inline-block relative">
            <a
              href="#"
              className="text-blue-700 underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                setShowGuide(!showGuide);
              }}
            >
              Xem hướng dẫn nhập tên
            </a>

            <NameGuidePopover
              show={showGuide}
              onClose={() => setShowGuide(false)}
            />
          </div>
        </div>
      </div>

      {/* Người lớn 1 */}
      <div className="bg-[#f1f8ff] font-medium py-2 px-4 mb-5 rounded">
        Người lớn 1
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-2 gap-4">
        {/* Danh xưng */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Danh xưng <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white transition duration-300 ease-in-out hover:border-gray-600">
            <option value="">Chọn danh xưng</option>
            <option>Ông</option>
            <option>Bà</option>
            <option>Cô</option>
            <option>Chú</option>
          </select>
        </div>

        <div></div>

        {/* Họ */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Họ (vd: Nguyen) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-300 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <p className="text-xs text-gray-500 mt-1">
            như trên CMND (không dấu)
          </p>
        </div>

        {/* Tên đệm & tên */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tên Đệm & Tên (vd: Thi Ngoc Anh){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-300 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <p className="text-xs text-gray-500 mt-1">
            như trên CMND (không dấu)
          </p>
        </div>

        {/* Ngày sinh */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="DD"
              className="w-1/3 border border-gray-300 rounded px-2 py-2 text-center transition duration-300 ease-in-out hover:border-gray-600"
            />
            <input
              type="text"
              placeholder="MMMM"
              className="w-1/3 border border-gray-300 rounded px-2 py-2 text-center transition duration-300 ease-in-out hover:border-gray-600"
            />
            <input
              type="text"
              placeholder="YYYY"
              className="w-1/3 border border-gray-300 rounded px-2 py-2 text-center transition duration-300 ease-in-out hover:border-gray-600"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hành khách người lớn (trên 12 tuổi)
          </p>
        </div>

        {/* Quốc tịch */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Quốc tịch <span className="text-red-500">*</span>
          </label>
          <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white transition duration-300 ease-in-out hover:border-gray-600">
            <option value="">Chọn quốc tịch</option>
            <option value="VN">Việt Nam</option>
            <option value="US">Hoa Kỳ</option>
            {/* Thêm quốc tịch khác nếu cần */}
          </select>
        </div>

        {/* CCCD */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Số căn cước công dân <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 transition duration-300 ease-in-out hover:border-gray-600 focus:outline-none focus:ring focus:ring-blue-200"
            placeholder=""
          />
          <p className="text-xs text-gray-500 mt-1">
            Đối với hành khách là trẻ em hoặc trẻ sơ sinh, vui lòng nhập giấy tờ
            tùy thân của người giám hộ đi cùng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Information_Customer;
