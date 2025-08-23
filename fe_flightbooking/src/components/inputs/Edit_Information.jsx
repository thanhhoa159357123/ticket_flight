import React, { useState } from "react";
import InputField from "./InputFieldAuth"; // đường dẫn tuỳ theo project

const Edit_Information = ({ fieldLabel, currentValue, onSave, onCancel }) => {
  const [value, setValue] = useState(currentValue || "");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="w-[90%] max-w-md bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
          <h3 className="text-xl font-semibold text-white">
            Chỉnh sửa {fieldLabel}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <InputField
            label={`Nhập ${fieldLabel} mới`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={() => onSave(value)}
              className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit_Information;
