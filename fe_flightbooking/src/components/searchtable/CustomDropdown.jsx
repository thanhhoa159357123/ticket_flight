import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ value, options = [], onChange, placeholder, disabledValue }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];
  const selected = safeOptions.find((opt) => opt?.code === value);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        role="button"
        className="flex items-center justify-between px-2 md:px-4 py-2 bg-[#f8f9fa] cursor-pointer min-h-[36px] md:min-h-[44px]"
      >
        <span className="text-[#017EBE] font-medium truncate text-sm md:text-base">
          Sân bay {selected?.name || placeholder || "Chọn địa điểm"}
        </span>
        <svg
          className={`w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 text-[#017EBE] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto"
        >
          {safeOptions.length > 0 ? (
            safeOptions.map((option, i) => {
              const isDisabled = disabledValue && option?.code === disabledValue;
              const isSelected = option?.code === value;

              return (
                <li
                  role="option"
                  aria-selected={isSelected}
                  key={option?.code || i}
                  onClick={() => {
                    if (!isDisabled && onChange && option?.code) {
                      onChange(option.code);
                      setOpen(false);
                    }
                  }}
                  className={`px-3 md:px-4 py-2 transition truncate text-sm md:text-base ${
                    isDisabled
                      ? "text-gray-400 cursor-not-allowed bg-gray-100"
                      : isSelected
                      ? "bg-blue-100 font-semibold text-[#017EBE]"
                      : "hover:bg-[#f1f5f9] text-[#017EBE] cursor-pointer"
                  }`}
                >
                  {option?.name || ""} ({option?.code || ""})
                  {isDisabled && " (Đã chọn)"}
                </li>
              );
            })
          ) : (
            <li className="px-3 md:px-4 py-2 text-gray-500 text-center text-sm md:text-base">
              Không có dữ liệu
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

function areEqual(prev, next) {
  return (
    prev.value === next.value &&
    prev.options.length === next.options.length &&
    prev.placeholder === next.placeholder &&
    prev.disabledValue === next.disabledValue
  );
}

export default React.memo(CustomDropdown, areEqual);