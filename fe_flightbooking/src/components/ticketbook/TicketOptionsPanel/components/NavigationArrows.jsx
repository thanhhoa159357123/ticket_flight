import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NavigationArrows = ({ showLeft, showRight, onLeft, onRight }) => {
  if (!showLeft && !showRight) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={onLeft}
        disabled={!showLeft}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
          showLeft
            ? "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
            : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <ArrowBackIcon className="w-5 h-5" />
      </button>
      <button
        onClick={onRight}
        disabled={!showRight}
        className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${
          showRight
            ? "bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400"
            : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <ArrowForwardIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default NavigationArrows;
