import TicketPackageCard from "./TicketPackageCard";
import NavigationArrows from "./NavigationArrows";

const PackagesSection = ({
  packages,
  loading,
  error,
  optionListRef,
  showLeftArrow,
  showRightArrow,
  scrollLeft,
  scrollRight,
  onShowMoreDetail,
  onChoose,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Title */}
      <div className="sticky top-0 bg-white px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Các gói vé có sẵn</h3>
          <p className="text-sm text-gray-500">
            {loading
              ? "Đang tải..."
              : error
              ? "Có lỗi xảy ra"
              : `${packages.length} gói lựa chọn`}
          </p>
        </div>
        {packages.length > 1 && !loading && (
          <NavigationArrows
            showLeft={showLeftArrow}
            showRight={showRightArrow}
            onLeft={scrollLeft}
            onRight={scrollRight}
          />
        )}
      </div>

      {/* Danh sách gói vé */}
      <div className="px-5 py-4">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải gói vé...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : packages.length > 0 ? (
          <div
            className="flex gap-5 pb-2 overflow-x-auto scroll-smooth"
            ref={optionListRef}
            style={{ scrollbarWidth: "none" }}
          >
            {packages.map((pkg, idx) => (
              <TicketPackageCard
                key={`${pkg.ma_ve || pkg.ma_gia_ve}_${idx}`}
                pkg={pkg}
                onShowMoreDetail={() => onShowMoreDetail(pkg)}
                onChoose={onChoose}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Hiện không có gói vé nào khả dụng
          </p>
        )}
      </div>
    </div>
  );
};

export default PackagesSection;
