// src/components/RoundTripConfirmPanel/RoundTripHeader.jsx
const RoundTripHeader = ({ onClose }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
    <div className="flex items-center px-4 py-3">
      <button
        onClick={onClose}
        className="mr-3 p-1.5 rounded-full hover:bg-white/20 transition-colors"
      >
        ✕
      </button>
      <div className="flex-1">
        <h2 className="text-lg lg:text-xl font-bold">Chọn gói vé khứ hồi</h2>
        <p className="text-blue-100 opacity-90 text-xs">
          Chọn gói vé phù hợp cho chuyến đi và chuyến về
        </p>
      </div>
    </div>
  </div>
);

export default RoundTripHeader;
