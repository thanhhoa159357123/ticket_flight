const InputField = ({ label, type, placeholder, value, onChange, error }) => (
  <div className="mb-3">
    <label className="block mb-1 font-medium text-[#017EBE] text-[0.9rem]">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full py-2 border-b-2 text-base font-medium rounded-none
        transition-all duration-300
        caret-[#017EBE] text-[#1F2937] placeholder-[#9CA3AF]
        border-[#d1d5db] focus:outline-none
        ${error ? "border-red-500 text-red-500 placeholder-red-400" : "focus:border-[#4A8DFF]"}`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default InputField;
