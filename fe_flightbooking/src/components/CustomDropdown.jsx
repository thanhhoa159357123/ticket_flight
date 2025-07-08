import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ value, options, onChange, placeholder }) => {
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

  const selected = options.find((opt) => opt.code === value);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-[#f8f9fa]  cursor-pointer"
      >
        <span className="text-gray-700 font-medium truncate">
          {selected ? selected.display : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, i) => (
            <li
              key={i}
              onClick={() => {
                onChange(option.code);
                setOpen(false);
              }}
              className={`px-4 py-2 hover:bg-[#f1f5f9] transition text-gray-800 cursor-pointer truncate`}
            >
              {option.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
