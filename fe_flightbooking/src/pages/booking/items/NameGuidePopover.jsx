import React from "react";
import CloseIcon from '@mui/icons-material/Close';

const NameGuidePopover = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="absolute left-full top-0 ml-4 w-[340px] z-30 bg-white shadow-lg border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold">Hướng dẫn nhập tên</h3>
        <CloseIcon onClick={onClose} className="text-gray-500 transition duration-200 ease cursor-pointer hover:text-black text-lg leading-none"/>
      </div>

      <img
        src="https://ik.imagekit.io/tvlk/image/imageResource/2024/01/02/1704184829016-0d69afb53a1a09d0996a4e915a0cdebe.png?tr=q-75"
        alt="Hướng dẫn CCCD"
        className="w-full border border-gray-300 mb-3"
      />

      <p className="text-sm text-gray-700 mb-2">
        Đảm bảo rằng tên của hành khách được nhập chính xác như trên ID do chính phủ cấp. Hãy làm theo ví dụ này:
      </p>

      <p className="text-sm font-medium">Nội dung bạn nhập vào trường tên phải là:</p>

      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
        <div>
          <p className="text-gray-500">Họ</p>
          <p className="font-semibold">Nguyen</p>
        </div>
        <div>
          <p className="text-gray-500">Tên Đệm & Tên</p>
          <p className="font-semibold">Thi Ngoc Anh</p>
        </div>
      </div>
    </div>
  );
};

export default NameGuidePopover;
