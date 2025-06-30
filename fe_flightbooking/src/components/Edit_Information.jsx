import React, { useState } from "react";

const Edit_Information = ({ fieldLabel, currentValue, onSave, onCancel }) => {
  const [value, setValue] = useState(currentValue || "");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-none">
      <div className="w-[90%] max-w-[500px] bg-white p-8 rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] animate-fade-in-up">
        <h3 className="mb-6 text-[20px] font-semibold text-[#1a202c]">
          Chỉnh sửa {fieldLabel}
        </h3>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full mb-6 px-4 py-3 text-[16px] rounded-lg border border-[#e2e8f0] transition-all focus:outline-none focus:border-[#4299e1] focus:ring-2 focus:ring-[#4299e1]/30"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onSave(value)}
            className="px-6 py-3 text-white bg-[#4299e1] hover:bg-[#3182ce] font-medium text-[16px] rounded-lg cursor-pointer transition-all duration-200 ease"
          >
            Đồng ý
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 text-[#4a5568] bg-white border border-[#e2e8f0] hover:bg-[#f7fafc] hover:border-[#cbd5e0] font-medium text-[16px] rounded-lg cursor-pointer transition-all duration-200 ease"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit_Information;
